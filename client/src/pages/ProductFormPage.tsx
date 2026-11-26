import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { buttonClassName } from "../components/Button";
import { ProductForm } from "../components/ProductForm";
import { ErrorState, LoadingState } from "../components/StateMessages";
import { useToast } from "../components/ToastProvider";
import { useProduct } from "../hooks/useProduct";
import { createProduct, updateProduct } from "../services/productService";
import { ProductFormValues, ProductPayload } from "../types/product";
import { emptyFormValues, toFormValues } from "../utils/productForm";

export function ProductFormPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { showToast } = useToast();
  const { state, retry } = useProduct(id);

  const edit = id !== undefined;
  const back = edit ? "/products/" + id : "/products";

  async function save(p: ProductPayload) {
    if (state.status === "ready") {
      await updateProduct(state.product.id, p);
      showToast("success", "Updated: " + p.name);
    } else {
      await createProduct(p);
      showToast("success", "Added: " + p.name);
    }
    nav("/products");
  }

  function view() {
    if (edit && (state.status === "loading" || state.status === "idle")) {
      return <LoadingState label="…" />;
    }
    if (state.status === "not-found") {
      return (
        <ErrorState
          title="Missing"
          message="Product gone."
          action={
            <Link to="/products" className={buttonClassName("secondary")}>
              Back
            </Link>
          }
        />
      );
    }
    if (state.status === "error") {
      return <ErrorState title="Error" message={state.message} onRetry={retry} />;
    }

    const iv: ProductFormValues = state.status === "ready" ? toFormValues(state.product) : emptyFormValues;
    return (
      <ProductForm
        initialValues={iv}
        submitLabel={edit ? "Save" : "Add"}
        submittingLabel={edit ? "Saving…" : "Adding…"}
        onSubmit={save}
        onCancel={() => nav(back)}
      />
    );
  }

  return (
    <div className="page page-narrow">
      <Link to={back} className="back-link">
        <ArrowLeft size={16} />
        {edit ? "Back" : "Back"}
      </Link>
      <header className="page-header">
        <div>
          <h1>{edit ? "Edit" : "Add"}</h1>
          <p className="page-description">
            {edit
              ? "Change details, then save."
              : "Fill in details."}
          </p>
        </div>
      </header>
      <section className="panel panel-padded">{view()}</section>
    </div>
  );
}
