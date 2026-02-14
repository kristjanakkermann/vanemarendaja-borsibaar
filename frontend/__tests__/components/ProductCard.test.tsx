import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "@/app/(protected)/(sidebar)/pos/[stationId]/ProductCard";
import { Product, CartItem } from "@/app/(protected)/(sidebar)/pos/[stationId]/types";

const mockProduct: Product = {
  id: 1,
  organizationId: 1,
  productId: 101,
  productName: "Test Beer",
  quantity: 50,
  unitPrice: 3.5,
  basePrice: 3.0,
  updatedAt: "2025-01-01T00:00:00Z",
};

describe("ProductCard", () => {
  it("renders product name and price", () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
    expect(screen.getByText("Test Beer")).toBeInTheDocument();
    expect(screen.getByText("$3.50")).toBeInTheDocument();
  });

  it("shows 'In Stock' when quantity is high", () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
    expect(screen.getByText("In Stock")).toBeInTheDocument();
  });

  it("shows 'Low Stock' when quantity is below 10", () => {
    const lowStockProduct = { ...mockProduct, quantity: 5 };
    render(<ProductCard product={lowStockProduct} onAddToCart={jest.fn()} />);
    expect(screen.getByText("Low Stock")).toBeInTheDocument();
  });

  it("shows 'Out of Stock' when quantity is 0", () => {
    const outOfStockProduct = { ...mockProduct, quantity: 0 };
    render(
      <ProductCard product={outOfStockProduct} onAddToCart={jest.fn()} />
    );
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("calls onAddToCart when clicked", () => {
    const onAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    fireEvent.click(screen.getByText("Test Beer"));
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it("shows cart quantity when item is in cart", () => {
    const cartItem: CartItem = {
      productId: 101,
      productName: "Test Beer",
      quantity: 3,
      maxQuantity: 50,
      unitPrice: 3.5,
    };
    render(
      <ProductCard
        product={mockProduct}
        cartItem={cartItem}
        onAddToCart={jest.fn()}
      />
    );
    expect(screen.getByText("In cart: 3")).toBeInTheDocument();
  });

  it("shows base price", () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
    expect(screen.getByText("$3.00")).toBeInTheDocument();
  });

  it("shows stock count", () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
    expect(screen.getByText("Stock: 50")).toBeInTheDocument();
  });
});
