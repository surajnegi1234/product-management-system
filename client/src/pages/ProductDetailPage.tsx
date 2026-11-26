import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, buttonClassName } from "../components/Button";
import { DeleteProductDialog } from "../components/DeleteProductDialog";
import { ErrorState, LoadingState } from "../components/StateMessages";
import { useToast } from "../components/ToastProvider";
import { useProduct } from "../hooks/useProduct";
import { Product } from "../types/product";
import { formatDateTime, formatPrice } from "../utils/format";

function Det({ p: Product }) {
  return (
    <dl className="details-grid">
      <div>
        <dt>ID</dt>
        <dd>{Product.id}</dd>
      </div>
      <div>
        <dt>Category</dt>
        <dd>{Product.category ?? <span className="muted">None</span>}</dd>
      </div>
      <div>
        <dt>Price</dt>
        <dd>{formatPrice(Product.price)}</dd>
      </div>
      <div>
        <dt>Stock</dt>
        <dd>{Product.quantity === 0 ? <span className="out-of-stock">0</span> : Product.quantity}</dd>
      </div>
      <div>
        <dt>Created</dt>
        <dd>{formatDateTime(Product.createdAt)}</dd>
      </div>
      <div className="details-wide">
        <dt>Description</dt>
        <dd className="details-description">
          {Product.description ?? <span className="muted">–</span>}
        </dd>
      </div>
    </dl>
  );
}

export function ProductDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { showToast } = useToast();
  const { state, retry } = useProduct(id);
  const [open, setOpen] = useState(false);

  function onDel(p: Product) {
    showToast("success", "Deleted: " + p.name);
    nav("/products");
  }

  function body() {
    if (state.status === "idle" || state.status === "loading") {
      return <section className="panel"><LoadingState label="…" /></section>;
    }
    if (state.status === "not-found") {
      return (
        <section className="panel">
          <ErrorState
            title="Missing"
            message="Product gone."
            action={
              <Link to="/products" className={buttonClassName("secondary")}>
                Back
              </Link>
            }
          />
        </section>
      );
    }
    if (state.status === "error") {
      return <section className="panel"><ErrorState title="Error" message={state.message} onRetry={retry} /></section>;
    }

    const { product } = state;
    return (
      <>
        <header className="page-header">
          <div>
            <h1>{product.name}</h1>
            <p className="page-description">Details</p>
          </div>
          <div className="header-actions">
            <Link to={"/products/" + product.id + "/edit"} className={buttonClassName("secondary")}>
              <Pencil size={16} />
              Edit
            </Link>
            <Button variant="danger" onClick={() => setOpen(true)}>
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        </header>
        <section className="panel panel-padded">
          <Det p={product} />
        </section>
        {open && (
          <DeleteProductDialog
            product={product}
            onDeleted={() => onDel(product)}
            onCancel={() => setOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="page page-narrow">
      <Link to="/products" className="back-link">
        <ArrowLeft size={16} />
        Back
      </Link>
      {body()}
    </div>
  );
}
