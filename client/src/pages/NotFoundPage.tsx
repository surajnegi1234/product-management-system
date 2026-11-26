import { Link } from "react-router-dom";
import { buttonClassName } from "../components/Button";
import { ErrorState } from "../components/StateMessages";

export function NotFoundPage() {
  return (
    <div className="page page-narrow">
      <section className="panel">
        <ErrorState
          title="Page not found"
          message="The page you’re looking for doesn’t exist."
          action={
            <Link to="/products" className={buttonClassName("primary")}>
              Go to products
            </Link>
          }
        />
      </section>
    </div>
  );
}
