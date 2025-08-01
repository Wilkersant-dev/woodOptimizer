import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FormSheet({ newSheet, setNewSheet, addSheet }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Adicionar Chapa</h3>
      <div className="flex flex-col gap-2">
        <Input
          type="number"
          placeholder="Largura"
          value={newSheet.largura}
          onChange={(e) => setNewSheet({ ...newSheet, largura: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Altura"
          value={newSheet.altura}
          onChange={(e) => setNewSheet({ ...newSheet, altura: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Espessura"
          value={newSheet.espessura}
          onChange={(e) => setNewSheet({ ...newSheet, espessura: e.target.value })}
        />
        <Button onClick={addSheet} className="mt-2">
          Adicionar Chapa
        </Button>
      </div>
    </div>
  );
}
