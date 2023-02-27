
import {getAccessToken} from './utilities.js';
const rootURL = 'https://photo-app-secured.herokuapp.com';

const showStories = async (token) => {
    const endpoint = `${rootURL}/api/stories`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    console.log('Stories:', data);
    const start = document.querySelector("story");
    let storyData = data.map(storyToHTML).join("");
    start.innerHTML = storyData;
}

const storyToHTML = story =>{
    return`
        <section class="storypannel">
            <button><img class="storyimg" src=${story.user.image_url}></img></button>
            <p class="sugest">${story.user.username}</p>
        </section>
    `;
}

const showPosts = async (token) => {
    console.log('code to show posts');

    const endpoint = `${rootURL}/api/posts`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })

    const data = await response.json();
    console.log('Posts:', data);

    const start = document.querySelector("post");
    let postData = data.map(postToHTML).join("");
    start.innerHTML = postData;

}

const postToHTML = post => {
    return`
    <card>
    <random>
        <heading class="cardhead">  
            <button><h2>${post.user.username}</h2></button>
            <button><h2><i class="fa-solid fa-ellipsis"></i></h2></button>
        </heading>
        <img class="post" src="${post.user.image_url}"></img>
        <symbols>
            <left>
                <i class="fa-regular fa-heart"></i>
                <i class="fa-regular fa-comment"></i>
                <i class="fa-regular fa-paper-plane"></i>
            </left>
            <i class="fa-regular fa-bookmark"></i>
        </symbols>
        <likes>
            <b>${post.likes.length} Likes</b>
        </likes>
        <imgcaption>
            <b>${post.user.username}</b>
            <p>${post.caption}</p>
        </imgcaption>
        <comments>
            <comment>
            </comment>
            <comment>
                <button class="follow">view all ${post.comments.length} comment</button>
            </comment>
        </comments>
        <p id="timestamp">${post.display_time}</p>
        <typecomment>
            <typeleft>
                <smile>
                    <i class="fa-regular fa-face-smile"></i>
                </smile>
                <type>
                </type>
            </typeleft>
            <postbutton>
                <button>Post</button>
            </postbutton>
        </typecomment>
            
    </random>
    </card>
    `;
}

const showUser = async (token) =>{
    console.log('code to show user');

    //fetches data for the user part of the right pannel
    const endpoint = `${rootURL}/api/profile`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })

    const data = await response.json();
    console.log('User Data:', data);

    const start = document.querySelector("user");
    let userData = data.map(userToHTML).join("");
    start.innerHTML = userData;
}

const userToHTML = data =>{
    return`
    <header id="rechead">
        <img class="headimg" src=${data.image_url}></img>
        <h2 class = "userinfo">${data.username}</h2>
    </header>
    <h3 id="subtitle"> Suggestions for you</h3> 
`
}

const showRecomended = async (token) =>{
    console.log('code to show recomended');

    const endpoint = `${rootURL}/api/suggestions`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })

    const data = await response.json();
    console.log('Recomended Data:', data);

    const start = document.querySelector("recomended");
    let recomendData = data.map(recomendToHTML).join("");
    start.innerHTML = recomendData;
}


const recomendToHTML = data =>{
    return`
    <section class="rec">
        <front>
            <img class="profimg" src=${data.image_url}></img>
            <subtext>
                    <div class="a">${data.username}</div>
                    <h4 class="b">sugested for you</h4>
            </subtext>
        </front>
        <button class="follow"><p>follow</p></button>
    </section>
    `
}

const initPage = async () => {
    // first log in (we will build on this after Spring Break):
    const token = await getAccessToken(rootURL, 'webdev', 'password');

    // then use the access token provided to access data on the user's behalf
    showStories(token);
    showPosts(token);
    showUser(token);
    showRecomended(token);
}

initPage();
