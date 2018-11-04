import React from 'react';
import ReactDOM from 'react-dom';

window.perf = { hoc: [], ext: [], onUpdate: () => {} };
// HOC's first run is super slow, so I omit it for fairness
window.mean = a => a.slice(1).reduce((v, s) => v + s, 0) / (a.length - 1);
let s;

// extend-style
class Togglable extends React.Component {
  constructor() {
    super();
    this.state = { open: false };
    this.toggle = this.toggle.bind(this);
  }
  componentDidUpdate() {
    window.perf.ext.push(performance.now() - s);
    perf.onUpdate();
  }
  toggle() {
    s = performance.now();
    this.setState({ open: !this.state.open });
  }
}

class TogglerExt extends Togglable {
  render() {
    return (<div onClick={this.toggle}>
      click me
      {this.state.open ? <div>i am open</div> : null}
    </div>);
  }
}


// HOC-style
const withToggle = Cmp => {
  return class WithToggle extends React.Component {
    constructor() {
      super();
      this.state = { open: false };
      this.toggle = this.toggle.bind(this);
    }
    componentDidUpdate() {
      window.perf.hoc.push(performance.now() - s);
      perf.onUpdate();
    }
    toggle() {
      s = performance.now();
      this.setState({ open: !this.state.open });
    }
    render() {
      return <Cmp open={this.state.open} toggle={this.toggle} />;
    }
  };
}

const TogglerHoc = withToggle(p => {
  return (<div onClick={ p.toggle }>
    click me
    { p.open ? <div>i am open</div> : null }
  </div>);
});

// set up the benchmark
const hocMount = document.createElement('div');
document.body.appendChild(hocMount);
ReactDOM.render(<TogglerHoc />, hocMount);
const extMount = document.createElement('div');
document.body.appendChild(extMount);
ReactDOM.render(<TogglerExt />, extMount);

// set up the stats
const Stat = () => (
  <div>
    mean HOC: { mean(perf.hoc) } <br />
    mean extend: { mean(perf.ext) }
  </div>
);
const statMount = document.createElement('div');
document.body.appendChild(statMount);
perf.onUpdate = () => ReactDOM.render(<Stat />, statMount);
