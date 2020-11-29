import React, { useState } from "react";
import { EmptyState, Layout, Page } from "@shopify/polaris";
import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import store from "store-js";
import ProductList from "../Components/ProductList";
import axios from "axios";

function index() {
  const [modal, setModal] = useState({ open: false });
  const emptyState = !store.get("ids");

  function handleSelection(resources) {
    const idsFromResources = resources.selection.map((product) => product.id);
    setModal({ open: false });
    store.set("ids", idsFromResources);

    const selectedProducts = resources.selection;

    deleteApiData();

    selectedProducts.map((product) => makeApiCall(product));
  }

  async function deleteApiData(products) {
    const url = "/api/products";

    axios
      .delete(url)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  async function makeApiCall(products) {
    const url = "/api/products";

    axios
      .post(url, products)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  return (
    <Page>
      <TitleBar
        primaryAction={{
          content: "Select New Products",
          onAction: () => setModal({ open: true }),
        }}
      />
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        open={modal.open}
        onCancel={() => setModal({ open: false })}
        onSelection={(resources) => handleSelection(resources)}
      />

      {emptyState ? (
        <Layout>
          <EmptyState
            heading="Manage your inventory transfers"
            action={{
              content: "Select Products",
              onAction: () => setModal({ open: true }),
            }}
            image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
          >
            <p>Track and receive your incoming inventory from suppliers.</p>
          </EmptyState>
        </Layout>
      ) : (
        <ProductList />
      )}
    </Page>
  );
}

export default index;
