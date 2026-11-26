import { useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../services/api";
import { deleteProduct } from "../services/productService";
import { Product } from "../types/product";
import { Button } from "./Button";

interface DelDialogProps {
  product: Product;
  onDeleted: () => void;
  onCancel: () => void;
}

export function DeleteProductDialog({ product, onDeleted, onCancel }: DelDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [del, setDel] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  async function confirm() {
    setDel(true);
    setErr(null);
    try {
      await deleteProduct(product.id);
      onDeleted();
    } catch (e) {
      setErr(getErrorMessage(e));
      setDel(false);
    }
  }

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="del-title"
      aria-describedby="del-desc"
      onCancel={(ev) => {
        ev.preventDefault();
        if (!del) onCancel();
      }}
      onClick={(ev) => {
        if (ev.target === ev.currentTarget && !del) onCancel();
      }}
    >
      <div className="dialog-body">
        <h2 id="del-title">Delete “{product.name}”?</h2>
        <p id="del-desc">
          This permanently removes the product from the database. You can’t undo this.
        </p>
        {err && (
          <p className="form-alert" role="alert">
            {err}
          </p>
        )}
      </div>
      <div className="dialog-actions">
        <Button onClick={onCancel} disabled={del}>
          Cancel
        </Button>
        <Button variant="danger" onClick={confirm} disabled={del}>
          {del ? "Deleting…" : "Delete product"}
        </Button>
      </div>
    </dialog>
  );
}
