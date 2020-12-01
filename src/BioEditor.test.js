import React from "react";
import { render, fireEvent } from "@testing-library/react";

import ProfilePic from "./ProfilePic.js";

test("if profilepicture is falsy, it renders a default image", () => {
    const { container } = render(<ProfilePic />);

    console.log(container.innerHTML);

    expect(container.querySelector("img").src.endsWith("/default.svg")).toBe(
        true
    );
});

test("if profilepicture is provided, it renders that image", () => {
    const { container } = render(
        <ProfilePic profilepicture="https://nice.image/me.jpg" />
    );

    expect(container.querySelector("img").src).toBe(
        "https://nice.image/me.jpg"
    );
});

test("if user clicks image, it calls the toggleUploader func", () => {
    const toggleUploader = jest.fn(() => null);

    const { container } = render(
        <ProfilePic toggleUploader={toggleUploader} />
    );

    fireEvent.click(container.querySelector("img"));

    expect(toggleUploader.mock.calls.length).toBe(1);
});
