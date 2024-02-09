import { HTTPStatusCodes } from '../Database/HTTPStatusCodes.js';
import * as UserDatabase from '../Database/UserDatabase.js';

async function checkVerification() {
    const h1 = document.querySelector("h1");
    const p = document.querySelector("p");

    const params = (new URL(document.location)).searchParams;
    const token = params.get("token");

    if (token === undefined || token === null) {
        h1.innerHTML = 'Something went wrong';
        p.innerHTML = 'Please click the link in the email that was sent to you.';

        setTimeout(() => location.href = 'index.html', 4000);
    }
    
    const status = await UserDatabase.userVerification(token);

    if (status === HTTPStatusCodes.OKAY) {
        let time = 4;
        h1.innerHTML = 'Thank you! Your email has been verified';
        p.innerHTML = `You will be redirected to the app in ${time}...`;

        setInterval(() => {
            if (time === 1) {
                location.href = 'main.html';
            }
            time = time - 1;
            p.innerHTML = `You will be redirected to the app in ${time}...`;
        }, 1000)


        localStorage.setItem("token", token);
    } else {
        h1.innerHTML = 'Something went wrong';
        p.innerHTML = 'Please try verifying your account once more!';

        setTimeout(() => location.href = 'index.html', 4000);
    }
}

await checkVerification();