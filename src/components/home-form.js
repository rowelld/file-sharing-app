import React, { Component } from 'react'
import _ from 'lodash'

class HomeForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            form: {
                files: [],
                to: '',
                from: '',
                message: ''
            },

            errors: {
                to: null,
                from: null

            }
        };

        this._onTextChange = this._onTextChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._formValidation = this._formValidation.bind(this);
        this._onFileAdded = this._onFileAdded.bind(this);
        this._onFileRemove = this._onFileRemove.bind(this);
    }

    _onFileRemove(key) {
        let { files } = this.state.form;

        files.splice(key, 1);

        this.setState({
            form: {
                ...this.state.form,
                files: files
            }
        })

    }

    _onFileAdded(event) {
        let files = _.get(this.state, 'form.files', []);

        _.each(_.get(event, 'target.files', []), (file) => {
            files.push(file);
        });

        this.setState({
            form: {
                ...this.state.form,
                files: files
            }
        });

        console.log("Files: ", files);
    }

    _isEmail(emailAddress) {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return emailRegex.test(emailAddress)

    }

    _formValidation(fields = [], callback) {
        let { form, errors } = this.state;
        const validation = {
            from: [
                {
                    errorMessage: 'From is required.',
                    isValid: () => {
                        return form.from.length
                    }
                },
                {
                    errorMessage: 'Email is not valid.',
                    isValid: () => {
                        return this._isEmail(form.from)
                    }
                }
            ],
            to: [
                {
                    errorMessage: 'To is required.',
                    isValid: () => {
                        return form.to.length
                    }
                },
                {
                    errorMessage: 'Email is not valid.',
                    isValid: () => {
                        return this._isEmail(form.to)
                    }
                }
            ],
        }

        _.each(fields, (field) => {
            let fieldValidations = _.get(validation, field, []);
            errors[field] = null;
            _.each(fieldValidations, (fieldValidation) => {
                const isValid = fieldValidation.isValid();
                if (!isValid) {
                    errors[field] = fieldValidation.errorMessage;
                }
            });
        });

        this.setState({
            errors: errors
        }, () => {
            let isValid = true;

            _.each(errors, (err) => {
                if (err != null) {
                    isValid = false;
                }
            })
            return callback(isValid);
        });

    }

    _onSubmit(event) {
        event.preventDefault();
        this._formValidation(['from', 'to'], (isValid) => {
            console.log("the form is valid?", isValid)
        });

    }

    _onTextChange(event) {
        let { form } = this.state;
        // console.log("Event", event.target.name, event.target.value)

        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        form[fieldName] = fieldValue;
        this.setState({ form: form });
    }

    render() {
        const { form } = this.state;
        const { files } = form;

        return (<div className={'app-card'}>
            <form onSubmit={this._onSubmit}>
                <div className={'app-card-header'}>
                    <div className={'app-card-header-inner'}>
                        {
                            files.length ? <div className={'app-files-selected'}>
                                {
                                    files.map((file, index) => {
                                        return (
                                            <div key={index} className={'app-files-selected-item'}>
                                                <div className={'filename'}>{file.name}</div>
                                                <div className={'file-action'}> <button onClick={() => this._onFileRemove(index)} type={'button'} className={'app-file-remove'}>x</button> </div>
                                            </div>)
                                    })
                                }
                            </div> : null
                        }
                        <div className={"app-file-select-zone"} >
                            <label htmlFor={"input-file"}>
                                <input onChange={this._onFileAdded} id={"input-file"} type="file" multiple={true} />
                                <span className={"app-upload-icon"}></span>
                                <span className={"app-upload-description"}>Drag and drop your files here.</span>
                            </label>
                        </div>

                    </div>
                </div>
                <div className={'app-card-content'}>
                    <div className={'app-card-content-inner'}>
                        <div className={'app-form-item'}>
                            <label htmlFor={'to'}>Send to:</label>
                            <input onChange={this._onTextChange} value={form.to} name={"to"} placeholder={'Email Address'} type={'text'} id={'to'} />
                        </div>
                        <div className={'app-form-item'}>
                            <label htmlFor={'from'}>From:</label>
                            <input onChange={this._onTextChange} placeholder={'Your Email address'} name={"from"} type={'text'} id={'from'} />
                        </div>
                        <div className={'app-form-item'}>
                            <label htmlFor={'message'}>Message:</label>
                            <textarea onChange={this._onTextChange} placeholder={'Add a Note (optional)'} id={'message'} name={'message'}></textarea>
                        </div>

                        <div className={'app-form-action'}>
                            <button type={'submit'} className={'app-button primary'}>Send</button>
                        </div>

                    </div>
                </div>
            </form>
        </div>)
    }
}

export default HomeForm;