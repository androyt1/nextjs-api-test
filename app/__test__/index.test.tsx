import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../page";
import { expect, describe, it } from "@jest/globals";

describe("Page", () => {
    it("renders a heading", () => {
        render(<Home />);

        const heading = screen.getByRole("heading", { level: 1 });

        expect(heading).toBeInTheDocument();
    });
});
