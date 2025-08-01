import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FormPiece({ newPiece, setNewPiece, addPiece }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Adicionar Peça</h3>
      <div className="flex flex-col gap-2">
        <Input
          type="number"
          placeholder="Largura"
          value={newPiece.largura}
          onChange={(e) => setNewPiece({ ...newPiece, largura: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Altura"
          value={newPiece.altura}
          onChange={(e) => setNewPiece({ ...newPiece, altura: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Quantidade"
          value={newPiece.quantidade}
          onChange={(e) => setNewPiece({ ...newPiece, quantidade: e.target.value })}
        />
        <Button onClick={addPiece} className="mt-2">
          Adicionar Peça
        </Button>
      </div>
    </div>
  );
}
