import React from 'react';
import ReactDOM from 'react-dom';
import RIEStatefulBase from './RIEStatefulBase';

export default class RIETextArea extends RIEStatefulBase {
    keyDown = (event) => {
        if (event.keyCode === 27) { this.cancelEditing() }     // Escape
    };

    keyUp = () => {
        this.resizeInput(this.refs.input);
    };

    resizeInput = input => {
        if (!input.startH) { input.startH = input.offsetHeight; }
        const style = input.style;
        style.height = 0;                        // recalculate from 0, in case characters are deleted
        let desiredH = input.scrollHeight;
        style.height = Math.max(desiredH, input.startH) + 'px';
    };

    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.editing && !prevState.editing) {
            this.resizeInput(this.refs.input)
        }
    };

    renderEditingComponent = () => {
        return <textarea
            rows={this.props.rows}
            cols={this.props.cols}
            disabled={this.state.loading}
            className={this.makeClassString()}
            defaultValue={this.props.value}
            onInput={this.textChanged}
            onBlur={this.finishEditing}
            ref="input"
            onKeyDown={this.keyDown}
            onKeyUp={this.keyUp}
            {...this.props.editProps} />;
    };

    renderNormalComponent = () => {
        const value = this.state.newValue || this.props.value
        const spans_and_brs = []
        let i = 0
        value.split("\n").map(line => {
          spans_and_brs.push(<span key={i}>{line}</span>)
          spans_and_brs.push(<br key={i+1} />)
          i += 2
        })
        spans_and_brs.pop() // remove last br tag

        return <span
            tabIndex="0"
            className={this.makeClassString()}
            onFocus={this.startEditing}
            onClick={this.startEditing}
            {...this.props.defaultProps}>{spans_and_brs}</span>;
    };
}
