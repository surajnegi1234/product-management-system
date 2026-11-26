import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "../types/product";
import { formatDate, formatPrice } from "../utils/format";

interface ProductTableProps {
  products: Product[];
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, onDelete }: ProductTableProps) {
  return (
    <table className="product-table">
      <thead>
        <tr>
          <th scope="col">Product</th>
          <th scope="col">Category</th>
          <th scope="col" className="numeric">
            Price
          </th>
          <th scope="col" className="numeric">
            Quantity
          </th>
          <th scope="col">Created</th>
          <th scope="col">
            <span className="visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td data-label="Product">
              <Link to={`/products/${product.id}`} className="product-name">
                {product.name}
              </Link>
              <span className="product-id">ID {product.id}</span>
            </td>
            <td data-label="Category">{product.category ?? <span className="muted">—</span>}</td>
            <td data-label="Price" className="numeric">
              {formatPrice(product.price)}
            </td>
            <td data-label="Quantity" className="numeric">
              {product.quantity === 0 ? <span className="out-of-stock">Out of stock</span> : product.quantity}
            </td>
            <td data-label="Created">{formatDate(product.createdAt)}</td>
            <td className="actions-cell">
              <div className="row-actions">
                <Link
                  to={`/products/${product.id}`}
                  className="icon-button"
                  aria-label={`View ${product.name}`}
                  title="View"
                >
                  <Eye size={16} />
                </Link>
                <Link
                  to={`/products/${product.id}/edit`}
                  className="icon-button"
                  aria-label={`Edit ${product.name}`}
                  title="Edit"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  type="button"
                  className="icon-button icon-button-danger"
                  aria-label={`Delete ${product.name}`}
                  title="Delete"
                  onClick={() => onDelete(product)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
