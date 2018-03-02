import React from 'react';
import {connect} from 'react-redux';
import {renderIf} from '../../../lib/utils';
import CategoryForm from '../category-form/category-form';
import {categoryUpdate, categoryDelete} from '../../../actions/category-actions';

import ExpenseForm from '../../expense/expense-form/expense-form';
import ExpenseItem from '../../expense/expense-item/expense-item';
import {expenseCreate} from '../../../actions/expense-actions';

class CategoryItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.category ?
      this.props.category :
      {
        name: '',
        budget: 0,
        editing: false,
      };

    let memberFunctions = Object.getOwnPropertyNames(CategoryItem.prototype);
    for (let functionName of memberFunctions) {
      if (functionName.startsWith('handle')) {
        this[functionName] = this[functionName].bind(this);
      }
    }
  }

  handleUpdate(cat) {
    this.setState({
      editing: !this.state.editing,
    });
    
    this.props.categoryItemCategoryUpdate(cat);
  }

  handleDelete(e) {
    e.preventDefault();
    this.props.categoryItemCategoryDelete(this.state);
  }

  render() {
    console.log('category-item props: ', this.props);

    return (
      <div className="category-item" key={this.props.category._id} onDoubleClick={this.handleUpdate}>
        <h2>{this.props.category.name}</h2>
        <p>Budget: ${this.props.category.budget}</p>
        <button onClick={this.handleDelete}>{this.props.buttonText}</button>

        {renderIf(this.state.editing, <CategoryForm category={this.props.category} buttonText="update" onComplete={this.handleUpdate} />)}

        <ExpenseForm categoryId={this.props.category._id} buttonText="create expense" onComplete={this.props.expenseItemExpenseCreate} />

        {
          this.props.expense ?
            this.props.expense[this.props.category._id].map(exp => <ExpenseItem key={exp._id} expense={exp} buttonText="delete expense" />)
            :
            undefined
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categories: state,
  expense: state.expense,
});

const mapDispatchToProps = (dispatch, getState) => ({
  categoryItemCategoryUpdate: cat => dispatch(categoryUpdate(cat)),
  categoryItemCategoryDelete: cat => dispatch(categoryDelete(cat)),
  expenseItemExpenseCreate: exp => dispatch(expenseCreate(exp)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryItem);