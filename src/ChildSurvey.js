import { Dropdown } from 'semantic-ui-react';
import React, { Component } from 'react';

// answers and values
// we can internationalize these in rails
const modes = [ {value: "sb",   text: "School Bus"},
                {value: "b",    text: "Bicycle"},
                {value: "o",    text: "Other (skateboard, scooter, inline skates, etc.)"},
                {value: "t",    text: "Transit (city bus, subway, etc.)"},
                {value: "cp",   text: "Carpool (with children from other families)"},
                {value: "w",    text: "Walk"},
                {value: "fv",   text: "Family Vehicle (only children in your family)"} ];

const grades = [  { value: 'pk',   text: 'Pre-K'},
                  { value: 'k',    text: 'K'},
                  { value: '1',    text: '1'},
                  { value: '2',    text: '2'},
                  { value: '3',    text: '3'},
                  { value: '4',    text: '4'},
                  { value: '5',    text: '5'},
                  { value: '6',    text: '6'},
                  { value: '7',    text: '7'},
                  { value: '8',    text: '8'},
                  { value: '9',    text: '9'},
                  { value: '10',   text: '10'},
                  { value: '11',   text: '11'},
                  { value: '12',   text: '12'} ];

const yesNo = [ { value: 'y', text: 'Yes' },
                { value: 'n', text: 'No'  } ];

const TripReasonQuestion = ({id, mode, question, name}) => {
  if (mode === 'fv' || mode === 'cp' ) {
    return (
      <Dropdown placeholder={question} fluid selection 
                name={name}
                options={ yesNo } />
    )
  } else {
    return null
  }
}

class ChildSurvey extends Component {
  constructor(props) {
    super(props);

    this.state = {
      to: '',
      from: '',
      id: props.id
    }
  }

  updateTo = (event, el) => {
    this.setState({ to: el.value });
  }

  updateFrom = (event, el) => {
    this.setState({ from: el.value });
  }

  render() {
    return (
      <div className="child-survey">
        <div className="ui attached segment">
          <div className="ui top attached label">
            Child { this.state.id }
          </div>
          <Dropdown placeholder='What grade is your child in?' fluid selection 
                    options={ grades }
                    name={ `survey_response[grade_${this.state.id}]` } />

          <Dropdown placeholder='How does your child get TO school on most days?' fluid selection 
                    onChange={this.updateTo} 
                    options={ modes }
                    name={ `survey_response[to_school_${this.state.id}]` } />

          <TripReasonQuestion id={this.state.id} 
                              mode={this.state.to} 
                              name={ `survey_response[dropoff_${this.state.id}]` }
                              question='Do you usually drop off your child on your way to work or another destination?' />

          <Dropdown placeholder='How does your child get FROM school on most days?' fluid selection 
                    onChange={this.updateFrom} 
                    options={ modes }
                    name={ `survey_response[from_school_${this.state.id}]` } />

          <TripReasonQuestion id={this.state.id} 
                              mode={this.state.from} 
                              name={ `survey_response[pickup_${this.state.id}]` }
                              question='Do you usually pick up your child on your way to work or another destination?' />
        </div>
      </div>
    )
  }
} 

export default ChildSurvey;