import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { buttonClassName } from "../components/Button";
import { DeleteProductDialog } from "../components/DeleteProductDialog";
import { ProductTable } from "../components/ProductTable";
import { SearchInput } from "../components/SearchInput";
import { EmptyState, ErrorState, TableSkeleton } from "../components/StateMessages";
import { useToast } from "../components/ToastProvider";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { getErrorMessage } from "../services/api";
import { getProducts } from "../services/productService";
import { Product } from "../types/product";

const DB_MS = 300;

function cnt(n: number, s: string): string {
  const x = n === 1 ? "product" : "products";
  return s ? n + " " + x + " found" : n + " " + x;
}

export function ProductsPage() {
  const [sp, setSp] = useSearchParams();
  const [st, setSt] = useState(sp.get("search") ?? "");
  const ds = useDebouncedValue(st.trim(), DB_MS);

  const [list, setList] = useState<Product[]>([]);
  const [load, setLoad] = useState(true);
  const [once, setOnce] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [rc, setRc] = useState(0);
  const [delProd, setDelProd] = useState<Product | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    setSp(ds ? { search: ds } : {}, { replace: true });
  }, [ds]);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoad(true);
    setErr(null);

    getProducts(ds, ctrl.signal)
      .then((items) => {
        setList(items);
        setOnce(true);
        setLoad(false);
      })
      .catch((e: unknown) => {
        if (ctrl.signal.aborted) return;
        setErr(getErrorMessage(e));
        setLoad(false);
      });

    return () => ctrl.abort();
  }, [ds, rc]);

  function reload() {
    setRc((c) => c + 1);
  }

  function onDel() {
    if (delProd) {
      showToast("success", "“" + delProd.name + "” deleted.");
    }
    setDelProd(null);
    reload();
  }

  function view() {
    if (err) {
      return <ErrorState title="Load failed" message={err} onRetry={reload} />;
    }
    if (load && !once) {
      return <TableSkeleton />;
    }
    if (list.length === 0) {
      return ds ? (
        <EmptyState
          title="No matches"
          description={"Nothing found for “" + ds + "”. Try again."}
        />
      ) : (
        <EmptyState
          title="Empty"
          description="Add your first product."
          action={
            <Link to="/products/new" className={buttonClassName("primary")}>
              <Plus size={16} />
              Add product
            </Link>
          }
        />
      );
    }
    return (
      <div className={load ? "table-wrapper is-refreshing" : "table-wrapper"}>
        <ProductTable products={list} onDelete={setDelProd} />
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Products</h1>
          <p className="page-description">
            Manage your items: add, edit, delete, search.
          </p>
        </div>
        <Link to="/products/new" className={buttonClassName("primary")}>
          <Plus size={16} />
          Add product
        </Link>
      </header>

      <div className="toolbar">
        <SearchInput value={st} onChange={setSt} />
        <p className="result-count" aria-live="polite">
          {once && !err ? cnt(list.length, ds) : ""}
        </p>
      </div>

      <section className="panel" aria-label="Product list">
        {view()}
      </section>

      {delProd && (
        <DeleteProductDialog
          product={delProd}
          onDeleted={onDel}
          onCancel={() => setDelProd(null)}
        />
      )}
    </div>
  );
}
