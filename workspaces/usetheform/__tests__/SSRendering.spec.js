/**
 * @jest-environment node
 */
import React from "react";
import ReactDOMServer from "react-dom/server.node";
import { JSDOM } from "jsdom";
import {
  Form,
  Input,
  Collection,
  Select,
  createFormStore,
  useField
} from "./../src";

describe("SSR => Form", () => {
  it("should correctly SSR render form with initial values", () => {
    const html = ReactDOMServer.renderToString(
      <Form
        formStore={formStore}
        initialState={{
          custom_initialState: { test: "test" },
          selectMultiple: ["abc", "def"],
          select: "ghi",
          text: "abc_text",
          number: 10,
          radio: "abc_radio",
          checkbox: "abc_checkbox",
          date: "1985-11-14",
          collection: {
            radio_collection: "abc_radio_collection",
            checkbox_collection: "checkbox_collection"
          }
        }}
      >
        <CustomField name={"custom_createFormStore"} />
        <CustomField name={"custom"} initialVal={{ test: "test" }} />
        <CustomField name={"custom_initialState"} />

        <Input type="range" name="range" min="0" max="100" value="10" />
        <Input type="range" name="range_createFormStore" min="0" max="100" />

        <Input type="date" name="date" />
        <Input type="date" name="date_value" value="1985-11-14" />

        <Input name="text_no_initial" type="text" />
        <Input name="text" type="text" />
        <Input name="text_createFormStore" type="text" />
        <Input name="text_value" type="text" value="abc_text" />
        <Input name="number" type="number" />

        <Input name="radio" type="radio" value="abc_radio" />
        <Input
          name="radio_createFormStore"
          type="radio"
          value="radio_createFormStore"
        />
        <Input name="checkbox" type="checkbox" value="abc_checkbox" />

        <Collection object name="collection" as="div">
          <Input
            name="radio_collection"
            type="radio"
            value="abc_radio_collection"
          />
          <Input
            name="checkbox_collection"
            type="checkbox"
            value="abc_checkbox_collection"
          />
          <Input name="text_no_initial_collection" type="text" />
        </Collection>

        <Select name="select_not_initial" value="def">
          <option value="">Select an option</option>
          <option value="abc">abc</option>
          <option value="def">def</option>
          <option value="ghi">ghi</option>
        </Select>

        <Select name="select">
          <option value="">Select an option</option>
          <option value="abc">abc</option>
          <option value="def">def</option>
          <option value="ghi">ghi</option>
        </Select>

        <Select name="selectMultiple" multiple>
          <option value="">Select an option</option>
          <option value="abc">abc</option>
          <option value="def">def</option>
          <option value="ghi">ghi</option>
        </Select>

        <Select name="selectMultiple_createFormStore" multiple>
          <option value="">Select an option</option>
          <option value="abc">abc</option>
          <option value="def">def</option>
          <option value="ghi">ghi</option>
        </Select>
      </Form>
    );

    // Simulate the DOM using JSDOM
    const dom = new JSDOM(html);
    const { document } = dom.window;

    // ✅ CustomField
    expect(document.querySelector(".custom").textContent).toBe(
      '{"test":"test"}'
    );
    expect(document.querySelector(".custom_createFormStore").textContent).toBe(
      '{"test":"test"}'
    );
    expect(document.querySelector(".custom_initialState").textContent).toBe(
      '{"test":"test"}'
    );

    // ✅ Range Inputs
    expect(document.querySelector('[name="range"]').value).toBe("10");
    expect(document.querySelector('[name="range_createFormStore"]').value).toBe(
      "20"
    );

    // ✅ Date Inputs
    expect(document.querySelector('[name="date"]').value).toBe("1985-11-14");
    expect(document.querySelector('[name="date_value"]').value).toBe(
      "1985-11-14"
    );

    // ✅ Radios and Checkboxes
    expect(
      document.querySelector('[name="radio"][value="abc_radio"]').checked
    ).toBe(true);
    expect(
      document.querySelector('[name="checkbox"][value="abc_checkbox"]').checked
    ).toBe(true);
    expect(
      document.querySelector(
        '[name="radio_createFormStore"][value="radio_createFormStore"]'
      ).checked
    ).toBe(true);

    // ✅ Text Inputs
    expect(document.querySelector('[name="text_value"]').value).toBe(
      "abc_text"
    );
    expect(document.querySelector('[name="text_no_initial"]').value).toBe("");
    expect(document.querySelector('[name="text_createFormStore"]').value).toBe(
      "text_createFormStore"
    );
    expect(document.querySelector('[name="text"]').value).toBe("abc_text");
    expect(document.querySelector('[name="number"]').value).toBe("10");

    // ✅ Collections
    expect(
      document.querySelector(
        '[name="radio_collection"][value="abc_radio_collection"]'
      ).checked
    ).toBe(true);
    expect(
      document.querySelector(
        '[name="checkbox_collection"][value="abc_checkbox_collection"]'
      ).checked
    ).toBe(true);
    expect(
      document.querySelector('[name="text_no_initial_collection"]').value
    ).toBe("");

    // ✅ Single Selects
    expect(
      document.querySelector('[name="select_not_initial"] option[selected]')
        .textContent
    ).toBe("def");
    expect(
      document.querySelector('[name="select"] option[selected]').textContent
    ).toBe("ghi");

    // ✅ Multi-selects
    const selectedOptions = document.querySelector(
      '[name="selectMultiple"]'
    ).selectedOptions;
    const selectedValues = Array.from(selectedOptions).map(
      option => option.value
    );
    expect(selectedValues).toEqual(["abc", "def"]);

    const selectMultipleFormStore = document.querySelector(
      '[name="selectMultiple_createFormStore"]'
    ).selectedOptions;
    const selectedValues_createFormStore = Array.from(
      selectMultipleFormStore
    ).map(option => option.value);
    expect(selectedValues_createFormStore).toEqual(["abc", "def"]);
  });
});

const [formStore] = createFormStore({
  text_createFormStore: "text_createFormStore",
  radio_createFormStore: "radio_createFormStore",
  range_createFormStore: "20",
  selectMultiple_createFormStore: ["abc", "def"],
  custom_createFormStore: { test: "test" }
});

const CustomField = ({ name, initialVal }) => {
  const { value } = useField({
    name,
    type: "custom",
    value: initialVal
  });
  return <div className={name}>{JSON.stringify(value)}</div>;
};
