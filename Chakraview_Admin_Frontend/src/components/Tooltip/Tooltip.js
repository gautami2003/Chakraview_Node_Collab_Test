import React, { useState, useEffect } from "react";
import "./Tooltip.css";

const Tooltip = ({ targetId, text, position = "top" }) => {
    const [visible, setVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const el = document.getElementById(targetId);
        if (el) {
            const showTooltip = () => {
                const rect = el.getBoundingClientRect();
                const scrollY = window.scrollY;
                const scrollX = window.scrollX;

                let top = 0;
                let left = 0;

                switch (position) {
                    case "top":
                        top = rect.top + scrollY - 40;
                        left = rect.left + scrollX + rect.width / 2;
                        break;
                    case "bottom":
                        top = rect.bottom + scrollY + 10;
                        left = rect.left + scrollX + rect.width / 2;
                        break;
                    case "left":
                        top = rect.top + scrollY + rect.height / 2;
                        left = rect.left + scrollX - 10;
                        break;
                    case "right":
                        top = rect.top + scrollY + rect.height / 2;
                        left = rect.right + scrollX + 10;
                        break;
                    default:
                        top = rect.top + scrollY - 40;
                        left = rect.left + scrollX + rect.width / 2;
                }

                setCoords({ top, left });
                setVisible(true);
            };

            const hideTooltip = () => setVisible(false);

            el.addEventListener("mouseenter", showTooltip);
            el.addEventListener("mouseleave", hideTooltip);

            return () => {
                el.removeEventListener("mouseenter", showTooltip);
                el.removeEventListener("mouseleave", hideTooltip);
            };
        }
    }, [targetId, position]);

    const tooltipStyles = {
        top: coords.top,
        left: coords.left,
        position: "absolute",
        transform:
            position === "top" || position === "bottom"
                ? "translateX(-50%)"
                : position === "left"
                    ? "translateX(-100%) translateY(-50%)"
                    : "translateY(-50%)", // right
    };

    return (
        <>
            {visible && (
                <div className={`custom-tooltip-box ${position}`} style={tooltipStyles}>
                    {text}
                    <span className={`custom-tooltip-arrow ${position}`}></span>
                </div>
            )}
        </>
    );
};

export default Tooltip;
