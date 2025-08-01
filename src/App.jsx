// Componentes importados
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { v4 as uuidv4 } from "uuid";
import FormPiece from "./components/FormPiece";
import FormSheet from "./components/FormSheet";
import CutPreview from "./components/CutPreview";
import { motion } from "framer-motion";

// Gerador de cores
const generateColor = (index) => {
  const colors = [
    "#93c5fd", "#fca5a5", "#6ee7b7", "#fcd34d",
    "#c4b5fd", "#fdba74", "#67e8f9", "#f9a8d4",
    "#a5f3fc", "#bef264"
  ];
  return colors[index % colors.length];
};

export default function CortePlanner() {
  const [pieces, setPieces] = useState([]);
  const [newPiece, setNewPiece] = useState({ largura: "", altura: "", quantidade: "" });
  const [sheets, setSheets] = useState([]);
  const [newSheet, setNewSheet] = useState({ largura: "", altura: "", espessura: "" });
  const [kerf, setKerf] = useState("3");
  const [optimizedCuts, setOptimizedCuts] = useState([]);
  const pdfRef = useRef();

  const addPiece = () => {
    if (!newPiece.largura || !newPiece.altura || !newPiece.quantidade) return;
    setPieces([...pieces, { ...newPiece, id: uuidv4() }]);
    setNewPiece({ largura: "", altura: "", quantidade: "" });
  };

  const addSheet = () => {
    if (!newSheet.largura || !newSheet.altura || !newSheet.espessura) return;
    setSheets([...sheets, { ...newSheet, id: uuidv4() }]);
    setNewSheet({ largura: "", altura: "", espessura: "" });
  };

  const generateOptimizedCut = () => {
    const kerfValue = parseFloat(kerf);
    let piecesList = [];
    pieces.forEach((p, typeIndex) => {
      for (let i = 0; i < parseInt(p.quantidade); i++) {
        piecesList.push({
          largura: parseFloat(p.largura),
          altura: parseFloat(p.altura),
          typeIndex
        });
      }
    });

    const cuts = [];
    let remainingPieces = [...piecesList];

    sheets.forEach((sheet, sheetIndex) => {
      let sheetWidth = parseFloat(sheet.largura);
      let sheetHeight = parseFloat(sheet.altura);
      let used = [];

      for (let y = 0; y < sheetHeight && remainingPieces.length > 0;) {
        let rowHeight = 0;
        let x = 0;

        for (let i = 0; i < remainingPieces.length;) {
          const p = remainingPieces[i];
          let fitsNormal = x + p.largura <= sheetWidth && y + p.altura <= sheetHeight;
          let fitsRotated = x + p.altura <= sheetWidth && y + p.largura <= sheetHeight;

          if (fitsNormal || fitsRotated) {
            const largura = fitsNormal ? p.largura : p.altura;
            const altura = fitsNormal ? p.altura : p.largura;
            used.push({ ...p, x, y, largura, altura, sheetIndex });
            x += largura + kerfValue;
            rowHeight = Math.max(rowHeight, altura);
            remainingPieces.splice(i, 1);
          } else {
            i++;
          }
        }
        y += rowHeight + kerfValue;
      }

      if (used.length > 0) {
        cuts.push({ sheet: sheetIndex + 1, width: sheetWidth, height: sheetHeight, used });
      }
    });

    setOptimizedCuts(cuts);
  };

  const exportPDF = async () => {
    const canvas = await html2canvas(pdfRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.setFontSize(16);
    pdf.text("Plano de Corte - " + new Date().toLocaleDateString(), 20, 30);
    pdf.addImage(imgData, "PNG", 0, 40, width, height);
    pdf.addPage();

    const totalPecas = pieces.reduce((acc, p) => acc + parseInt(p.quantidade), 0);
    pdf.setFontSize(14);
    pdf.text("Resumo do Plano de Corte", 20, 40);
    pdf.setFontSize(12);
    pdf.text(`Total de chapas utilizadas: ${optimizedCuts.length}`, 20, 70);
    pdf.text(`Total de peças otimizadas: ${totalPecas}`, 20, 90);

    pieces.forEach((p, idx) => {
      pdf.setFillColor(generateColor(idx));
      pdf.rect(20, 110 + idx * 20, 10, 10, 'F');
      pdf.text(`${p.largura} x ${p.altura} (${p.quantidade}x)`, 40, 120 + idx * 20);
    });

    pdf.save("plano_de_corte.pdf");
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto p-4 space-y-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 text-center">Plano de Corte - Otimizado</h1>

      <Card className="p-4">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormPiece newPiece={newPiece} setNewPiece={setNewPiece} addPiece={addPiece} />
          <FormSheet newSheet={newSheet} setNewSheet={setNewSheet} addSheet={addSheet} />
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-2 rounded-xl" onClick={generateOptimizedCut}>
          Gerar Plano de Corte
        </Button>
      </div>

      {optimizedCuts.length > 0 && (
        <CutPreview
          optimizedCuts={optimizedCuts}
          pieces={pieces}
          generateColor={generateColor}
          pdfRef={pdfRef}
          exportPDF={exportPDF}
        />
      )}
    </motion.div>
  );
}
