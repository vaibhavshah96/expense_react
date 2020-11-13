import React, { Component } from "react";
import AppNav from "./AppNav";
class Category extends Component {
  state = {
    isLoading: true,
    Categories: [],
  };

  async componentDidMount() {
    const appUrl =
      "http://expense-env-1.eba-nryufvyt.us-east-2.elasticbeanstalk.com/api/categories";
    console.log(appUrl);
    const response = await fetch(appUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const body = await response.json();
    console.log(response);
    this.setState({ Categories: body, isLoading: false });
  }

  render() {
    const { Categories, isLoading } = this.state;
    if (isLoading) return <div>LOADING...</div>;

    return (
      <div>
        <AppNav />
        <h2> Categories </h2>
        {Categories.map((category) => (
          <div id={category.id}>{category.name}</div>
        ))}
      </div>
    );
  }
}

export default Category;
