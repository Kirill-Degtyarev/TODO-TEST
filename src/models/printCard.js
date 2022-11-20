export default class PrintCard {
    constructor(id, name, caption, sortIndex, date, userEmails, users, tags, tasklist) {
        this.id = id;
        this.name = name;
        this.caption = caption;
        this.sortIndex = sortIndex;
        this.date = date !== null ? date.toDate() : date;
        this.userEmails = userEmails;
        this.users = users;
        this.tags = tags;
        this.tasklist = tasklist;
    }
}
