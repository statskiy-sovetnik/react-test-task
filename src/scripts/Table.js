import React from "react";

class Table extends React.Component {

    constructor(props) {
        super(props);

        this.SHOW_MEMBERS = 4; //сколько человек отображается на одной странице таблицы

        this.state = {
            sort_function: null,  //может быть date, fee, distance
            least: false,  //true, если сортировка от меньшего к большему
            current_page: 1, //текущая активная страница таблицы
        }
    }

    renderTableBody() {
        let rows = [];
        const members = this.props.members.slice();
        const members_num = members.length;
        let start_member_ind, end_member_ind;
        const cur_page = this.state.current_page;

        if(!members_num) {
            return React.createElement("tbody", [], []);
        }

        start_member_ind = (cur_page - 1) * this.SHOW_MEMBERS;
        end_member_ind = Math.min(cur_page * this.SHOW_MEMBERS - 1, members_num - 1);

        for(let i = start_member_ind; i <= end_member_ind; i++) {
            rows.push((
                <tr key={"table-row-" + i}>
                    <td>{members[i].member_name}</td>
                    <td>{members[i].day + "." + members[i].month + "." + members[i].year}</td>
                    <td>{members[i].email}</td>
                    <td>{members[i].phone}</td>
                    <td>{members[i].distance}</td>
                    <td>{members[i].fee}</td>
                </tr>
            ));
        }

        //Сортировка участников
        switch(this.state.sort_function) {
            case "date":
                if(this.state.least) {
                    rows.sort((a, b) => {return this.compareMembersByDateLeast(a, b)});
                }
                else {
                    rows.sort((a, b) => {return this.compareMembersByDateGreater(a, b)});
                }
                break;
            case "fee":
                if(this.state.least) {
                    rows.sort((a, b) => {return this.compareMembersByFeeLeast(a, b)})
                }
                else {
                    rows.sort((a, b) => {return this.compareMembersByFeeGreater(a, b)})
                }
                break;
            case "distance":
                if(this.state.least) {
                    rows.sort((a, b) => {return this.compareMembersByDistLeast(a, b)})
                }
                else {
                    rows.sort((a, b) => {return this.compareMembersByDistGreater(a, b)})
                }
                break;
            default:
                break;
        }

        return React.createElement("tbody", [], rows);
    }

    renderPaginationList() {
        let list_elems = [];
        const members_num = this.props.members.length;
        const pages_num = Math.ceil( members_num / this.SHOW_MEMBERS);
        const prev_disable_str = (this.state.current_page === 1 || pages_num === 1) ? " disabled" : "";
        const next_disable_str = (this.state.current_page === pages_num || pages_num === 1) ? " disabled" : "";

        if(pages_num === 1) {
            return;
        }

        //Добавляем кнопку "назад"
        list_elems.push(
            <li key="page-back" className={"page-item" + prev_disable_str}>
                <a
                    onClick={(event) => {
                        event.preventDefault();
                        this.goToPage(this.state.current_page - 1);
                    }}
                    className="page-link" href="#">
                    Назад
                </a>
            </li>
        )

        for(let i = 0; i < pages_num; i++) {
            list_elems.push(
                <li key={"page-" + (i + 1)} className="page-item">
                    <a
                        onClick={(event) => {
                            event.preventDefault();
                            this.goToPage(i + 1);
                        }}
                        className={"page-link"} href="#">
                        {i + 1}
                    </a>
                </li>
            )
        }

        //Добавляем кнопку "вперед"
        list_elems.push(
            <li key="page-forward" className={"page-item" + next_disable_str}>
                <a
                    onClick={(event) => {
                        event.preventDefault();
                        this.goToPage(this.state.current_page + 1);
                    }}
                    className="page-link" href="#">
                    Вперёд
                </a>
            </li>
        )

        return React.createElement("ul", {className: "pagination"}, list_elems);
    }

    goToPage(page) {
        this.setState({
            current_page: +page,
        })
    }

    compareMembersByDateLeast(member_1, member_2) {
        const date_ind_in_row = 1;
        const date1 = member_1.props.children[date_ind_in_row].props.children.split(".");
        const date2 = member_2.props.children[date_ind_in_row].props.children.split(".");

        return -(+date1[2] * 365 + +date1[1] * 30 + +date1[0]) + (
            +date2[2] * 365 + +date2[1] * 30 + +date2[0]
        );
    }

    compareMembersByDateGreater(member_1, member_2) {
        return -this.compareMembersByDateLeast(member_1, member_2);
    }

    compareMembersByFeeLeast(member_1, member_2) {
        const fee_ind_in_row = 5;
        const fee1 = +member_1.props.children[fee_ind_in_row].props.children.split(" ")[0];
        const fee2 = +member_2.props.children[fee_ind_in_row].props.children.split(" ")[0];

        return fee1 - fee2;
    }

    compareMembersByFeeGreater(member_1, member_2) {
        return -this.compareMembersByFeeLeast(member_1, member_2);
    }

    compareMembersByDistLeast(member_1, member_2) {
        const dist_ind_in_row = 4;
        const dist1 = +member_1.props.children[dist_ind_in_row].props.children.split(" ")[0];
        const dist2 = +member_2.props.children[dist_ind_in_row].props.children.split(" ")[0];

        return dist1 - dist2;
    }

    compareMembersByDistGreater(member_1, member_2) {
        return -this.compareMembersByDistLeast(member_1, member_2);
    }

    render() {
        let sort_name = "";
        switch (this.state.sort_function) {
            case "date":
                sort_name = " по дате"
                break;
            case "distance":
                sort_name = " по дистанции забега"
                break;
            case "fee":
                sort_name = " по взносу"
                break;
            default:
                sort_name = " нет";
        }
        if(this.state.sort_function !== null) {
            if(this.state.least) {
                sort_name += ", от меньшего к большему"
            }
            else {
                sort_name += ", от большего к меньшему"
            }
        }

        return (
            <div id="table-comp-wrapper">
                <h4 className="table-heading">Таблица участников</h4>

                <nav aria-label="Переход по таблице">
                    {this.renderPaginationList()}
                </nav>
                <p className="sort-heading">
                    {"Сортировка:" + sort_name + "; Страница: " + (this.state.current_page)}
                </p>
                <div className="table-wrapper">
                    <table className="table table-sm">
                        <thead>
                        <tr>
                            <th scope="col-3">ФИО</th>
                            <th scope="col-1">
                                <span
                                    onClick={() => {
                                        this.setState({
                                            sort_function: "date",
                                            least: true,
                                        })
                                    }}
                                    className="table-arrow-icon oi oi-caret-top"> </span>
                                <span
                                    onClick={() => {
                                        this.setState({
                                            sort_function: "date",
                                            least: false,
                                        })
                                    }}
                                    className="table-arrow-icon right-icon oi oi-caret-bottom"> </span>
                                Дата рождения
                            </th>
                            <th scope="col-3">Email</th>
                            <th scope="col-3">Телефон</th>
                            <th scope="col-1">
                                <span
                                    onClick={() => {
                                        this.setState({
                                            sort_function: "distance",
                                            least: true,
                                        })
                                    }}
                                    className="table-arrow-icon oi oi-caret-top"> </span>
                                <span
                                    onClick={() => {
                                        this.setState({
                                            sort_function: "distance",
                                            least: false,
                                        })
                                    }}
                                    className="table-arrow-icon right-icon oi oi-caret-bottom"> </span>
                                Дистанция
                            </th>
                            <th scope="col-1">
                                <span
                                    onClick={() => {
                                        this.setState({
                                            sort_function: "fee",
                                            least: true,
                                        })
                                    }}
                                    className="table-arrow-icon oi oi-caret-top"> </span>
                                <span
                                    onClick={() => {
                                        this.setState({
                                            sort_function: "fee",
                                            least: false,
                                        })
                                    }}
                                    className="table-arrow-icon right-icon oi oi-caret-bottom"> </span>
                                Взнос
                            </th>
                        </tr>
                        </thead>
                        {this.renderTableBody()}
                    </table>
                </div>
            </div>
        )
    }
}

export {Table};
