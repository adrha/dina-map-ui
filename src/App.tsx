import axios from "axios";
import classNames from "classnames";
import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { Drawer } from "./components/drawer/Drawer";

export interface Feature {
  categoryShortName: string;
  description: string;
  name: string;
  urls: Array<{ name: string; url: string }>;
}

export interface Category {
  id: string;
  shortName: string;
  description: string;
  canUserAddObject: boolean;
  mapGeometry: string;
  categoryColor: string;
}

function App() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<{ features: Array<{ properties: Feature }> }>();
  const [map, setMap] = useState<L.Map | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFilter, setFilter] = useState<string[]>([]);
  const [layer, setLayer] = useState<L.Layer | null>();

  useEffect(() => {
    if (!map) return;
    if (layer) map.removeLayer(layer);
    // @ts-ignore
    setData(null);
    if (!categoryFilter.length) return;
    axios.get("MapObjects", { params: { categoryShortNames: categoryFilter.join(",") } }).then((res) => {
      setData(res.data);

      const geoJsonLayer = L.geoJSON(res.data, {
        style: (feature) => ({
          fillColor: getColorByCategory(feature?.properties.categoryShortName),
          fillOpacity: 0.5,
          color: "#000",
          // stroke: false,
        }),
      });
      // @ts-ignore
      geoJsonLayer.bindPopup((layer) => layer.feature.properties.description);
      map.addLayer(geoJsonLayer);
      map.fitBounds(geoJsonLayer.getBounds());
      setLayer(geoJsonLayer);
    });
  }, [categoryFilter]);

  useEffect(() => {
    axios.get<Category[]>("Categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const toggleFilter = (c: string) => {
    if (categoryFilter.includes(c)) {
      setFilter(categoryFilter.filter((f) => f !== c));
    } else {
      setFilter([...categoryFilter, c]);
    }
  };

  const getColorByCategory = (categoryShortName: string) =>
    categories.find((c) => c.shortName === categoryShortName)?.categoryColor;

  return (
    <>
      <div className="h-full">
        <MapContainer ref={setMap} center={[46.5, 8.4]} zoom={7} zoomControl={false} className="h-full">
          <TileLayer
            zIndex={1}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="topright" />
          {/* <Popup>Test</Popup> */}
          <div>
            <Drawer open={open} onRequestToggle={setOpen}>
              <div className="p-10">
                <h1>Filter:</h1>
                <div className="flex gap-1 flex-wrap">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => toggleFilter(c.shortName)}
                      className={classNames(
                        "flex gap-1 badge badge-lg flex-shrink-0",
                        categoryFilter.includes(c.shortName) && "badge-primary"
                      )}
                    >
                      <div style={{ backgroundColor: c.categoryColor }} className="w-1 h-1 p-1 rounded-full" />
                      {c.description}
                    </button>
                  ))}
                </div>
                <ul>
                  {data?.features?.length !== 0 &&
                    data?.features.map((f) => (
                      <li key={f.properties.name} className="card card-compact">
                        <div className="card-body">
                          <div className="card-title">
                            <div
                              style={{ backgroundColor: getColorByCategory(f.properties.categoryShortName) }}
                              className="w-1 h-1 p-1 rounded-full"
                            />
                            <h2>{f.properties.name}</h2>
                          </div>
                          <div dangerouslySetInnerHTML={{ __html: f.properties.description }}></div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </Drawer>
          </div>
        </MapContainer>
      </div>
    </>
  );
}

export default App;
