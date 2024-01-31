const NotificationEnum = Object.freeze({
    MessageNotificationType: NotificationEnum("Message", false),
    InvitationNotificationType: NotificationEnum("Join Study Group", true),
});
const ObjectIdRegex = /^[a-f\d]{24}$/i;
const EmailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

class Notification {
    #id;
    #sender;
    #reciever;
    #subject;
    #body;
    #notificationType;
    #isRead;
    #studyGroupId
    
    constructor(sender, reciever, subject, body, notificationType) {
        this.#sender = typeof sender === 'string' && sender.match(ObjectIdRegex) ? sender : "";
        this.#reciever = typeof reciever === 'string' && reciever.match(ObjectIdRegex) ? reciever : "";
        this.#subject = typeof subject === 'string' ? subject : "";
        this.#body = typeof body === 'string' ? body : "";
        this.#notificationType = `${notificationType}` in NotificationEnum ? notificationType : undefined;
    }

    get id() { return this.#id }
    get sender() { return this.#sender }
    get reciever() { return this.#reciever }
    get subject() { return this.#subject }
    get body() { return this.#body }
    get notificationType() { return this.#notificationType }
    get isRead() { return this.#isRead }
    get studyGroupId() { return this.#studyGroupId }

    set id(id) {
        this.#id = typeof id === 'string' && id.match(ObjectIdRegex) ? id : this.#id;
        return this;
    } 

    set sender(id) {
        this.#sender = typeof id === 'string' && id.match(ObjectIdRegex) ? id : this.#sender;
        return this;
    }

    set reciever(id) {
        this.#reciever = typeof id === 'string' && id.match(ObjectIdRegex) ? id : this.#reciever;
        return this;
    }

    set subject(subject) {
        this.#subject = typeof subject === 'string' && subject.length !== 0 ? subject : this.#subject;
        return this;
    }

    set body(body) {
        this.#body = typeof body === 'string' && body.length !== 0 ? body : this.#body;
        return this;
    }

    set notificationType(type) {
        this.#notificationType = `${type}` in NotificationEnum ? type : this.#notificationType;
        return this;
    }

    set isRead(isRead) {
        this.#isRead = typeof isRead === 'boolean' ? isRead : this.#isRead;
        return this;
    }

    set studyGroupId(id) {
        this.#studyGroupId = typeof id === 'string' && id.match(ObjectIdRegex) ? id : this.#studyGroupId;
        return this;
    }
}

class StuddyBuddy {
    constructor() {}
}

class User {
    #id;
    #email;
    #username;
    #password;
    #school;
    #majors;
    #profilePic;
    #verified;
    #tokens;

    constructor(email, username, password, school) {
        this.#email = typeof email === 'string' && email.match(EmailRegex) ? email : "";
        this.#username = typeof username === 'string' ? username : "";
        this.#password = typeof password === 'string' ? password : "";
        this.#school = typeof school === 'string' ? school : "";
    }

    get id() { return this.#id }
    get email() { return this.#email }
    get username() { return this.#username }
    get password() { return this.#password }
    get school() { return this.#school }
    get majors() { return this.#majors }
    get profilePic() { return this.#profilePic }
    get verified() { return this.#verified }
    get tokens() { return this.#tokens }

    set id(id) {
        this.#id = typeof id === 'string' && id.match(ObjectIdRegex) ? id : this.#id;
        return this;
    }

    set email(email) {
        this.#email = typeof email === 'string' && email.match(EmailRegex) ? email : this.#email;
        return this;
    }

    set username(username) {
        this.#username = typeof username === 'string' ? username : this.#username;
        return this;
    }

    set password(password) {
        this.#password = typeof password === 'string' ? password : this.#password;
        return this;
    }

    set school(school) {
        this.#school = typeof school === 'string' ? school : this.#school;
        return this;
    }

    set majors(majors) {
        this.#majors = Array.isArray(majors) && majors.every(major => typeof major === 'string') ? majors : this.#majors;
        return this;
    }

    set profilePic(pic) {
        this.#profilePic = pic instanceof Blob ? pic : this.#profilePic;
        return this;
    }

    set verified(verified) {
        this.#verified = typeof verified === 'boolean' ? verified : this.#verified;
        return this;
    }

    set tokens(tokens) {
        this.#tokens = Array.isArray(tokens) && tokens.every(token => typeof token === 'string') ? token : this.#tokens;
        return this;
    }

}


export { Notification, StuddyBuddy, User }