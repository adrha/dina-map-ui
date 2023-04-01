import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode } from "react";
import { FocusOn } from "react-focus-on";

interface Props {
  open?: boolean;
  onRequestToggle?: (open: boolean) => void;
  children?: ReactNode;
}

export const Drawer: React.FC<Props> = ({ children, open, onRequestToggle }) => {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={"fixed left-0 top-0 z-[1000] h-screen w-screen"}
            animate={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
          ></motion.div>
        )}
      </AnimatePresence>
      <motion.div>
        <FocusOn
          enabled={open}
          onEscapeKey={() => onRequestToggle?.(false)}
          onClickOutside={() => onRequestToggle?.(false)}
          returnFocus
        >
          <motion.div
            layout
            animate={{ top: open ? "20vh" : "80vh" }}
            transition={{ bounce: false, duration: 0.2, ease: "easeOut" }}
            role="dialog"
            className="fixed h-[80vh] w-full rounded-t-3xl z-[1001] bg-base-100 top-[20vh]"
          >
            <div className="h-full w-full overflow-y-auto">{children}</div>
            <motion.button
              animate={{ transform: open ? "rotate(90deg)" : "rotate(-90deg)" }}
              transition={{ bounce: false, duration: 0.2, ease: "easeOut" }}
              onClick={() => onRequestToggle?.(!open)}
              className="absolute top-6 right-6 h-8 w-8 rounded-full text-2xl"
            >
              ›
            </motion.button>
          </motion.div>
        </FocusOn>
      </motion.div>
    </>
  );
};
