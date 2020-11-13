import React, { Component } from "react";
import AppNav from "./AppNav";
import DatePicker from "react-datepicker";
import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import Moment from "react-moment";
import { Container, Form, FormGroup, Button, Table } from "reactstrap";
import { Link } from "react-router-dom";
import nextId from "react-id-generator";

class Expenses extends Component {
  emptyItem = {
    id: 103,
    expensedate: new Date(),
    location: "",
    category: { id: "", name: "Rent" },
  };

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      isLoading: true,
      Expenses: [],
      Categories: [],
      item: this.emptyItem,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  async handleSubmit(event) {
    const item = this.state.item;
    await fetch(
      `http://expense-env-1.eba-nryufvyt.us-east-2.elasticbeanstalk.com/api/expenses`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      }
    );
    event.preventDefault();
    this.props.history.push("/expenses");
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = { ...this.state.item };
    item[name] = value;
    this.setState({ item });
  }

  handleDateChange(date) {
    let item = { ...this.state.item };
    item.expensedate = date;
    this.setState({ item });
  }

  handleCategoryChange(event) {
    let item = { ...this.state.item };
    console.log(item.category.id);
  }

  async remove(id) {
    await fetch(
      `http://expense-env-1.eba-nryufvyt.us-east-2.elasticbeanstalk.com/api/expenses/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    ).then(() => {
      let updatedExpenses = [...this.state.Expenses].filter((i) => i.id !== id);
      this.setState({ Expenses: updatedExpenses });
    });
  }

  async componentDidMount() {
    const response = await fetch(
      "http://expense-env-1.eba-nryufvyt.us-east-2.elasticbeanstalk.com/api/categories",
      {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      }
    );
    const body = await response.json();
    this.setState({ Categories: body, isLoading: false });

    const responseExp = await fetch(
      "http://expense-env-1.eba-nryufvyt.us-east-2.elasticbeanstalk.com/api/expenses",
      {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      }
    );
    const bodyExp = await responseExp.json();
    this.setState({ Expenses: bodyExp, isLoading: false });
  }

  render() {
    const title = <h3>Add Expense Here</h3>;
    const { Categories } = this.state;
    const { Expenses, isLoading } = this.state;
    console.log(nextId());
    if (isLoading) return <div>Loading..</div>;

    let optionList = Categories.map((category) => (
      <option id={category.id} key={category.id}>
        {category.name}
      </option>
    ));

    let rows = Expenses.map((expense) => (
      <tr key={expense.id}>
        <td>{expense.description}</td>
        <td>{expense.location}</td>
        <td>{expense.category.name}</td>
        <td>
          <Moment date={expense.expensedate} format="YYYY/MM/DD" />
        </td>
        <td>
          <Button
            size="sm"
            color="danger"
            onClick={() => this.remove(expense.id)}
          >
            DELETE
          </Button>
        </td>
      </tr>
    ));

    return (
      <div>
        <AppNav />
        <Container>
          {title}
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <label htmlFor="description"> Title </label> <br />
              <input
                type="description"
                name="description"
                id="description"
                onChange={this.handleChange}
                autoComplete="name"
              />
              <br />
            </FormGroup>

            <FormGroup>
              <label htmlFor="category"> Category </label>
              <br />
              <select
                selected={this.state.item.category}
                // name="category"
                // id="category"
                onChange={this.handleCategoryChange}
              >
                {optionList}
              </select>

              {/* <input
                type="text"
                name="Category"
                id="Category"
                onChange={this.handleChange}
              /> */}
              <br />
            </FormGroup>

            <FormGroup>
              <label htmlFor="city"> Date </label>
              <br />
              <DatePicker
                selected={this.state.item.expensedate}
                onChange={this.handleDateChange}
              />
              <br />
            </FormGroup>

            <div className="row">
              <FormGroup className="col-md-4 mb-3">
                <label htmlFor="location"> Location </label>
                <br />
                <input
                  type="text"
                  name="location"
                  id="location"
                  onChange={this.handleChange}
                />
                <br />
              </FormGroup>
            </div>

            <FormGroup>
              <Button color="primary" type="submit">
                {" "}
                Save{" "}
              </Button>{" "}
              <Button color="secondary" tag={Link} to="/categories">
                Cancel
              </Button>
            </FormGroup>
          </Form>
        </Container>

        {""}

        <Container>
          <h3>Expense List</h3>
          <Table className="mt-4">
            <thead>
              <tr>
                <th width="20%">Description</th>
                <th width="20%">Location</th>
                <th>Category</th>
                <th>Date</th>
                <th width="10%">Action</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default Expenses;
