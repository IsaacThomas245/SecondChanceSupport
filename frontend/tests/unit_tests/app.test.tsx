import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";

import mockRouter from "next-router-mock";

import Counties from "@/app/county/page";
import County from "@/app/county/[id]/page";
import Reentries from "@/app/re-entry/page";
import Reentry from "@/app/re-entry/[id]/page";
import Rehabs from "@/app/rehab/page";
import Rehab from "@/app/rehab/[id]/page";
import Search from "@/app/search/page";

import About from "@/app/about/page";

jest.mock("next/navigation", () => jest.requireActual("next-router-mock"));

describe("Home Page", () => {
  it("Home Page Loads", () => {
    mockRouter.push("");
    render(<Home />);
    expect(screen.getByText(`Second Chance Support`)).toBeInTheDocument();
  });
  it("Home page matches snapshot", () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });
});

describe("Model Pages Load", () => {
  it("Counties Loads", () => {
    mockRouter.push("");
    render(<Counties />);

    expect(screen.getByText(`Counties`)).toBeInTheDocument();
    //const error = await screen.findByText("Angelina County");
  });

  it("Counties page matches snapshot", () => {
    const { container } = render(<Counties />);
    expect(container).toMatchSnapshot();
  });

  it("Rehabs Loads", () => {
    mockRouter.push("");
    render(<Rehabs />);

    expect(screen.getByText(`Rehab Resources`)).toBeInTheDocument();
    //const error = await screen.findByText("Angelina County");
  });

  it("Rehabs page matches snapshot", () => {
    const { container } = render(<Rehabs />);
    expect(container).toMatchSnapshot();
  });

  it("Reentries Loads", () => {
    mockRouter.push("");
    render(<Reentries />);

    expect(screen.getByText(`Re-Entry Resources`)).toBeInTheDocument();
    //const error = await screen.findByText("Angelina County");
  });

  it("Reentries page matches snapshot", () => {
    const { container } = render(<Reentries />);
    expect(container).toMatchSnapshot();
  });
});

describe("Instance Pages Load", () => {
  it("county instance loading", () => {
    render(<County params={{ id: 1 }} />);
    expect(screen.getByText(`Loading`)).toBeInTheDocument();
  });
  it("county page matches snapshot", () => {
    const { container } = render(<County params={{ id: 1 }} />);
    expect(container).toMatchSnapshot();
  });
  it("rehab instance loading", () => {
    render(<Rehab params={{ id: 1 }} />);
    expect(screen.getByText(`Loading`)).toBeInTheDocument();
  });
  it("rehab page matches snapshot", () => {
    const { container } = render(<Rehab params={{ id: 1 }} />);
    expect(container).toMatchSnapshot();
  });
  it("reentry page loading", () => {
    render(<Reentry params={{ id: 1 }} />);
    expect(screen.getByText(`Loading`)).toBeInTheDocument();
  });
  it("reentry page matches snapshot", () => {
    const { container } = render(<Reentry params={{ id: 1 }} />);
    expect(container).toMatchSnapshot();
  });
});

// describe("About Page", () => {
//   it("About page matches snapshot", () => {
//     const { container } = render(<About />);
//     expect(container).toMatchSnapshot();
//   });
// });
// it("Page Loads", async () => {
//   render(<About />);
//   expect(await screen.findByText("About")).toBeVisible();
//   await waitFor(() => expect(screen.findByText("About")).toBeVisible());
// });
// it("About Page Shows Cards", async () => {
//   render(<About />);
//   await waitFor(() =>
//     expect(screen.getByText("Isaac Thomas")).toBeInTheDocument()
//   );
// });
// it("About Page Shows Tools Cards", async () => {
//   render(<About />);
//   await waitFor(() =>
//     expect(screen.getByText(`Next.js`)).toBeInTheDocument()
//   );
// });

// describe("Search Page", () => {
//   it("Search page matches snapshot", () => {
//     const { container } = render(<Search />);
//     expect(container).toMatchSnapshot();
//   });
// });
