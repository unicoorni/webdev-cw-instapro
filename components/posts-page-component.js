import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, renderApp } from "../index.js";
import { addLikePost, removeLikePost } from "../api.js";
import { formatDistance } from "date-fns";
import { ru } from "date-fns/locale";
import { replaceSave } from "../helpers.js";

export function renderPostsPageComponent({ appEl }) {
  console.log("Актуальный список постов:", posts);
  let message = null;
  if (posts) {
    const getApiPosts = posts.map((postItem) => {
      return {
        postId: postItem.id,
        postImageUrl: postItem.imageUrl,
        postCreatedAt: formatDistance(
          new Date(postItem.createdAt),
          new Date(),
          { locale: ru }
        ),
        description: replaceSave(postItem.description),
        userId: postItem.user.id,
        userName: replaceSave(postItem.user.name),
        userLogin: postItem.user.login,
        postImageUserUrl: postItem.user.imageUrl,
        usersLikes: postItem.likes,
        isLiked: postItem.isLiked,
      };
    });
    message = getApiPosts
      .map((postItem, index) => {
        return `
			<li class="post">
			<div class="post-header" data-user-id="${postItem.userId}">
					<img src="${postItem.postImageUserUrl}" class="post-header__user-image">
					<p class="post-header__user-name">${postItem.userName}</p>
			</div>
			<div class="post-image-container">
				<img class="post-image" data-post-id="${postItem.postId}" src="${
          postItem.postImageUrl
        }"  data-index="${index}" >
			</div>
			<div class="post-likes">
				<button data-post-id="${postItem.postId}" data-like="${
          postItem.isLiked ? "true" : ""
        }" data-index="${index}" class="like-button">
					<img src=${
            postItem.isLiked
              ? "./assets/images/like-active.svg"
              : "./assets/images/like-not-active.svg"
          }>
				</button>
				<p class="post-likes-text">
				Нравится: ${
          postItem.usersLikes.length > 0
            ? `${postItem.usersLikes[postItem.usersLikes.length - 1].name} ${
                postItem.usersLikes.length - 1 > 0
                  ? "и ещё " + (postItem.usersLikes.length - 1)
                  : ""
              }`
            : "0"
        }
				</p>
			</div>
			<p class="post-text">
				<span class="user-name">${postItem.userName}</span>
				${postItem.description}
			</p>
			<p class="post-date">
			${postItem.postCreatedAt} назад
			</p>
		</li>`;
      })
      .join("");
  } else {
    message = "постов нет";
  }

  const originHtml = `	
	<div class="page-container">
	<div class="header-container"></div>
	<ul class="posts">
	${message}
	</ul>
</div>`;

  appEl.innerHTML = originHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
  likeEventListener({ token: getToken() });
  likeEventListenerOnIMG({ token: getToken() });
}

export function likeEventListener() {
  const likeButtons = document.querySelectorAll(".like-button");

  likeButtons.forEach((likeButton) => {
    likeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const postId = likeButton.dataset.postId;
      const index = likeButton.dataset.index;

      if (posts[index].isLiked) {
        removeLikePost({ token: getToken(), postId }).then((updatedPost) => {
          posts[index].isLiked = false;
          posts[index].likes = updatedPost.post.likes;
          renderApp();
        });
      } else {
        addLikePost({ token: getToken(), postId }).then((updatedPost) => {
          posts[index].isLiked = true;
          posts[index].likes = updatedPost.post.likes;

          renderApp();
        });
      }
    });
  });
}

export function likeEventListenerOnIMG() {
  const likeButtons = document.querySelectorAll(".post-image");

  likeButtons.forEach((likeButton) => {
    likeButton.addEventListener("dblclick", (event) => {
      event.stopPropagation();
      const postId = likeButton.dataset.postId;
      const index = likeButton.dataset.index;

      if (posts[index].isLiked) {
        removeLikePost({ token: getToken(), postId }).then((updatedPost) => {
          posts[index].isLiked = false;
          posts[index].likes = updatedPost.post.likes;
          renderApp();
        });
      } else {
        addLikePost({ token: getToken(), postId }).then((updatedPost) => {
          posts[index].isLiked = true;
          posts[index].likes = updatedPost.post.likes;

          renderApp();
        });
      }
    });
  });
}
