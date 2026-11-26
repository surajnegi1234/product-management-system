import { FormEvent, useState } from "react";
import { ApiRequestError, getErrorMessage } from "../services/api";
import { ProductFormErrors, ProductFormValues, ProductPayload } from "../types/product";
import { toPayload, validateProductForm } from "../utils/productForm";
import { Button } from "./Button";
import { FormField } from "./FormField";

interface ProductFormProps {
  initialValues: ProductFormValues;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (payload: ProductPayload) => Promise<void>;
  onCancel: () => void;
}

const FIELDS: (keyof ProductFormValues)[] = ["name", "description", "price", "quantity", "category"];

function descBy(id: string, err?: string, hint?: string): string | undefined {
  if (err) return id + "-error";
  if (hint) return id + "-hint";
  return undefined;
}

function fieldErr(details: Record<string, string>): ProductFormErrors {
  const e: ProductFormErrors = {};
  for (const f of FIELDS) {
    if (details[f]) e[f] = details[f];
  }
  return e;
}

export function ProductForm({ initialValues, submitLabel, submittingLabel, onSubmit, onCancel }: ProductFormProps) {
  const [vals, setVals] = useState<ProductFormValues>(initialValues);
  const [errs, setErrs] = useState<ProductFormErrors>({});
  const [subErr, setSubErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function onChange(field: keyof ProductFormValues, value: string) {
    setVals((c) => ({ ...c, [field]: value }));
    if (errs[field]) {
      setErrs((c) => ({ ...c, [field]: undefined }));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubErr(null);

    const ve = validateProductForm(vals);
    setErrs(ve);
    if (Object.keys(ve).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(toPayload(vals));
    } catch (err) {
      const fe = err instanceof ApiRequestError && err.details ? fieldErr(err.details) : {};
      if (Object.keys(fe).length > 0) {
        setErrs(fe);
      } else {
        setSubErr(getErrorMessage(err));
      }
      setSubmitting(false);
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      {subErr && (
        <p className="form-alert" role="alert">
          {subErr}
        </p>
      )}

      <FormField id="name" label="Product name" error={errs.name}>
        <input
          id="name"
          type="text"
          value={vals.name}
          onChange={(ev) => onChange("name", ev.target.value)}
          aria-invalid={Boolean(errs.name)}
          aria-describedby={descBy("name", errs.name)}
          autoComplete="off"
        />
      </FormField>

      <FormField id="description" label="Description" optional error={errs.description}>
        <textarea
          id="description"
          rows={4}
          value={vals.description}
          onChange={(ev) => onChange("description", ev.target.value)}
          aria-invalid={Boolean(errs.description)}
          aria-describedby={descBy("description", errs.description)}
        />
      </FormField>

      <div className="field-row">
        <FormField id="price" label="Price" error={errs.price} hint="Zero or more, up to two decimals.">
          <input
            id="price"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={vals.price}
            onChange={(ev) => onChange("price", ev.target.value)}
            aria-invalid={Boolean(errs.price)}
            aria-describedby={descBy("price", errs.price, "hint")}
          />
        </FormField>

        <FormField id="quantity" label="Quantity" error={errs.quantity} hint="Units in stock, whole numbers only.">
          <input
            id="quantity"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={vals.quantity}
            onChange={(ev) => onChange("quantity", ev.target.value)}
            aria-invalid={Boolean(errs.quantity)}
            aria-describedby={descBy("quantity", errs.quantity, "hint")}
          />
        </FormField>
      </div>

      <FormField id="category" label="Category" optional error={errs.category}>
        <input
          id="category"
          type="text"
          value={vals.category}
          onChange={(ev) => onChange("category", ev.target.value)}
          aria-invalid={Boolean(errs.category)}
          aria-describedby={descBy("category", errs.category)}
          autoComplete="off"
        />
      </FormField>

      <div className="form-actions">
        <Button onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
