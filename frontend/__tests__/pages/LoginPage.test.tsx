import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/(public)/login/page";

describe("LoginPage", () => {
  it("renders login heading", () => {
    render(<LoginPage />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("renders Google login button", () => {
    render(<LoginPage />);
    expect(screen.getByText("Login with Google")).toBeInTheDocument();
  });

  it("links to OAuth2 authorization endpoint", () => {
    render(<LoginPage />);
    const link = screen.getByText("Login with Google").closest("a");
    expect(link).toHaveAttribute(
      "href",
      "http://localhost:8080/oauth2/authorization/google"
    );
  });
});
