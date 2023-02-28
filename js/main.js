
import {getAccessToken} from './utilities.js';
const rootURL = 'https://photo-app-secured.herokuapp.com';


const modalElement = document.querySelector('.modal-bg');

window.openModal = (post) =>{
    console.log("open Modal called")
    
    let modal = document.querySelector(".modal-bg");
    let html = popModal(post);
    modal.innerHTML = html;

    // shows the modal:
    modalElement.classList.remove('hidden');

    // accessibility:
    modalElement.setAttribute('aria-hidden', 'false');

    // puts the focus on the "close" button:
    document.querySelector('.close').focus();
}

window.closeModal = () =>{
    // hides the modal:
    modalElement.classList.add('hidden');

    // accessibility:
    modalElement.setAttribute('aria-hidden', 'false');

    // puts the focus on the "open" button:
    document.querySelector('.open').focus();
}

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
    
    let comment = "";
    let moreComments = "";
    //if there is more than 0 it equals the first comment
    if(post.comments.length > 1){
        comment = `
        <comment>
                <b>${post.comments[0].user.username}</b>
                <p>${post.comments[0].text}</p>
            </comment>
        `;
        moreComments = `
        <comment>
            <button class="open" onclick="openModal(${post})">view all ${post.comments.length} comment</button>
        </comment>`;
    }

    let heart = `<i class="fa-regular fa-heart" ></i>`;

    //check to see if the post is liked or not
    if(post.current_user_like_id != null){
        heart = `
        <style>
        .fa{
            color: red;
        }
        }
        </style>
        <i class="fa fa-heart"></i>
        `;

    }

    //check to see if the post is bookmarked
    let mark = `<i class="fa-regular fa-bookmark"></i>`;

    if(post.current_user_bookmark_id != null){
        mark = `
        <style>
            .fa-bookmark{
                color: #2e3134;
            }
        </style>
        <i class="fa fa-bookmark"></i>
        `;
    }

    return`
    
    <card>
        <postContent>
        <heading class="cardhead">  
            <button><h2>${post.user.username}</h2></button>
            <button><h2><i class="fa-solid fa-ellipsis"></i></h2></button>
        </heading>
        <img class="post" src="${post.user.image_url}"></img>
        <symbols>
            <left>
                ${heart}
                <i class="fa-regular fa-comment"></i>
                <i class="fa-regular fa-paper-plane"></i>
            </left>
            ${mark}
        </symbols>
        <likes>
            <b>${post.likes.length} Likes</b>
        </likes>
        <imgcaption>
            <b>${post.user.username}</b>
            <p>${post.caption}</p>
        </imgcaption>
        <comments>
            ${comment}
            ${moreComments}
        </comments>
        <p id="timestamp">${post.display_time}</p>
        <typecomment>
            <typeleft>
                <smile>
                    <i class="fa-regular fa-face-smile"></i>
                </smile>
                <type>
                    <input type="text" placeholder="Add a comment..."/>
                </type>
            </typeleft>
            <postbutton>
                <button>Post</button>
            </postbutton>
        </typecomment>
        </postContent>
    </card>
    `;
    

}

const popModal = (post) =>{
    return`
    <section class="modal">
            <button class="close" aria-label="Close the modal window" onclick="closeModal(event);">Close</button>
            <div class="modal-body">
                <!-- Uses a background image -->
                <div>${post.user.username}</div>
            </div>
        </section>
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

    const header = document.querySelector("nav");
    let html = `<button id="username"><b>${data.username}</b></button>`;
    header.insertAdjacentHTML("afterbegin", html);

    const start = document.querySelector("user");
    let userData = userToHTML(data);
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

