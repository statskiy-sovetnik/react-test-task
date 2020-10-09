import React from "react";
import IMask from "imask";

class Form extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            member_name: null,
            email: null,
            day: null,
            month: null,
            year: null,
            phone: null,
            distance: null,
            fee: null,
            /*---*/
            is_phone_focused: false,  //true если поле с номеров телефона в фокусе
        }
    }

    //Берет значение поля и изменяет состояние компонента Form
    changeInputValueState(id) {
        let new_state_obj = {};
        const input = document.getElementById(id);
        let member_date = [];

        switch (id) {
            case "member_name":
                new_state_obj.member_name = (input.value === "") ? null : input.value;
                break;
            case "phone":
                new_state_obj.phone = (input.value === "") ? null : input.value;
                break;
            case "fee":
                new_state_obj.fee = (input.value === "") ? null : input.value + " руб.";
                break;
            case "member-email-input":
                new_state_obj.email = (input.value === "") ? null : input.value;
                break;
            case "date-input":
                if(input.value === "") {
                    new_state_obj.year = null;
                    new_state_obj.month = null;
                    new_state_obj.day = null;
                }
                else {
                    member_date = input.value.split("-");
                    new_state_obj.year = member_date[0];
                    new_state_obj.month = member_date[1];
                    new_state_obj.day = member_date[2];
                }
                break;
            case "distance-select":
                new_state_obj.distance = input.value;
                break;
            default:
                break;
        }

        this.setState(new_state_obj);
    }

    isPhoneValid(phone_number) {
        return phone_number == null ? false : phone_number.length === 11 + 5;
    }

    render() {

        //Проверка на заполненность полей
        let fields_filled = true;
        for(let key in this.state) {
            if(key === "distance") {
                continue;
            }
            if(this.state["" + key] == null) {
               fields_filled = false;
               break;
            }
        }
        
        const button = fields_filled ? (<button className="btn btn-primary">Отправить заявку</button>) :
            (<button disabled className="btn btn-primary">Отправить заявку</button>);

        let email_input = (
            <input onInput={(event) => {
                this.changeInputValueState(event.currentTarget.id)}
            } type="email" className="form-control" id="member-email-input"/>
        );

        //const phone_input_group_class_name = (this.state.is_phone_focused) ? " was-validated" : "";
        let phone_input_class_name = "";
        if(this.state.is_phone_focused) {
            phone_input_class_name = (this.isPhoneValid(this.state.phone)) ? " is-valid" : " is-invalid";
        }

        return (
            <div className="form-comp-wrapper">
                <h3 className="form-heading">Оставить заявку на участие в забеге</h3>
                <div className="form-wrapper">
                    <form>
                        <div className="form-group row">
                            <div className="col-4">
                                <label htmlFor="member_name" className="col-form-label">ФИО</label>
                            </div>
                            <div className="col-8">
                                <input
                                    onInput={(event) => {
                                        this.changeInputValueState(event.currentTarget.id)}
                                    }
                                    type="text" className="form-control" id="member_name"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-4">
                                <label htmlFor="date-input" className="col-form-label">Дата рождения</label>
                            </div>
                            <div className="col-8">
                                <input onInput={(event) => {
                                    this.changeInputValueState(event.currentTarget.id)}
                                } type="date" className="form-control" id="date-input"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-4">
                                <label htmlFor="member-email-input" className="col-form-label">Email</label>
                            </div>
                            <div className="col-8">
                                {email_input}
                            </div>
                        </div>
                        <div className={"form-group row"}>
                            <div className="col-4">
                                <label htmlFor="phone" className="col-form-label">Телефон</label>
                            </div>
                            <div className="col-8">
                                <input
                                    onInput={(event) => {
                                        this.changeInputValueState(event.currentTarget.id)}
                                    }
                                    onFocus={() => {this.setState({is_phone_focused: true})}}
                                    onBlur={() => {this.setState({is_phone_focused: false})}}
                                    type="tel"
                                    className={"form-control" + phone_input_class_name}
                                    id="phone"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-4">
                                <label htmlFor="distance-select" className="col-form-label">Дистанция</label>
                            </div>
                            <div className="col-8">
                                <select onBlur={(event) => {
                                    this.changeInputValueState(event.currentTarget.id)
                                }}
                                        id="distance-select" className="form-control" >
                                    <option>3 км</option>
                                    <option>5 км</option>
                                    <option>10 км</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-4">
                                <label htmlFor="fee" className="col-form-label">Сумма взноса, руб</label>
                            </div>
                            <div className="col-8">
                                <input onInput={(event) => {
                                    this.changeInputValueState(event.currentTarget.id)}
                                } type="number" className="form-control" id="fee"/>
                            </div>
                        </div>

                        {button}
                    </form>
                </div>
            </div>
        );
    }

    componentDidMount() {

        const phone_field = document.getElementById("phone");
        const options = {
            mask: "+{7}(000)000-00-00",
        }

        //Добавить маску набора телефонного номера
        let mask = IMask(phone_field, options);
    }
}

export {Form}