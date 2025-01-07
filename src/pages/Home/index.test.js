import { fireEvent, render, screen } from "@testing-library/react";
import Home from "./index";
import EventCard from "../../components/EventCard";

describe("When Form is created", () => {
  it("a list of fields card is displayed", async () => {
    render(<Home />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success message is displayed", async () => {
      render(<Home />);
      fireEvent(
        await screen.findByText("Envoyer"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      await screen.findByText("En cours");
      await screen.findByText("Message envoyé !");
    });
  });
});

describe("When a page is created", () => {
  it("a list of events is displayed", async () => {
    const { container } = render(<Home />);
    const Realisation = await container.querySelector("#Realisation");
    expect(Realisation.innerHTML).toEqual("Nos réalisations");
    const events = await container.querySelector("#events");
    expect(events).toBeInTheDocument();
  });
  it("a list a people is displayed", async () => {
    render(<Home />);
    await screen.findByText("Samira");
    await screen.findByText("Alice");
    await screen.findByText("Christine");
    await screen.findByText("Isabelle");
  });
  it("a footer is displayed", async () => {
    render(<Home />);
    const footer = screen.getByTestId("footer");
    expect(footer).toBeInTheDocument();
  });
  it("an event card, with the last event, is displayed", () => {});
  const mockProps = {
    imageSrc: "/images/event.jpg",
    imageAlt: "Description de l'image",
    label: "Événement",
    title: "Événement spécial",
    date: new Date("2025-01-01"),
  };
  render(
    <EventCard
      imageSrc={mockProps.imageSrc}
      imageAlt={mockProps.imageAlt}
      label={mockProps.label}
      title={mockProps.title}
      date={mockProps.date}
    />
  );
  const cardImage = screen.getByTestId("card-image-testid");
  expect(cardImage).toBeInTheDocument();
  expect(cardImage).toHaveAttribute("src", mockProps.imageSrc);
  expect(cardImage).toHaveAttribute("alt", mockProps.imageAlt);
});
