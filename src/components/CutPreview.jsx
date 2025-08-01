import React from "react";
import { Button } from "@/components/ui/button";

export default function CutPreview({ optimizedCuts, pieces, generateColor, pdfRef, exportPDF }) {
  return (
    <div className="mt-8 space-y-8" ref={pdfRef}>
      {optimizedCuts.map((cut, index) => (
        <div key={index}>
          <h3 className="font-semibold mb-2">Chapa #{cut.sheet}</h3>
          <div
            className="relative border border-gray-300 bg-white"
            style={{
              width: "100%",
              aspectRatio: `${cut.width} / ${cut.height}`,
              maxHeight: "400px",
              overflow: "hidden"
            }}
          >
            {cut.used.map((p, idx) => (
              <div
                key={idx}
                className="absolute border text-xs text-center overflow-hidden"
                style={{
                  left: `${(p.x / cut.width) * 100}%`,
                  top: `${(p.y / cut.height) * 100}%`,
                  width: `${(p.largura / cut.width) * 100}%`,
                  height: `${(p.altura / cut.height) * 100}%`,
                  backgroundColor: generateColor(p.typeIndex),
                  borderColor: "#333",
                  color: "#000",
                }}
              >
                {p.largura} x {p.altura}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-2 mt-4">
        {pieces.map((p, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: generateColor(idx) }}
            ></div>
            {p.largura} x {p.altura} ({p.quantidade}x)
          </div>
        ))}
      </div>

      <Button className="mt-4" onClick={exportPDF}>
        Exportar PDF
      </Button>
    </div>
  );
}
