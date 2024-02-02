import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { getPosts } from "../api.js";

import { formatDistance } from 'date-fns'
import { ru } from 'date-fns/locale'

export function renderPostsPageComponent({ appEl }) {
	
	console.log("Актуальный список постов:", posts);
	
	const getApiPosts = posts.map((postItem) => {
			return {
				userId: postItem.id,
				userImageUrl: postItem.imageUrl,
				postCreatedAt: formatDistance(new Date(postItem.createdAt), new Date, { locale: ru }),
				description: postItem.description,
				postId: postItem.user.id,
				userName: postItem.user.name,
				userLogin: postItem.user.login,
				postImageUrl: postItem.user.imageUrl,
				usersLikes: postItem.likes,
				isLiked: postItem.isLiked,
			}
		})

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  
  const appHtml = getApiPosts.map((postItem) => {
		return `
		<div class="page-container">
			<div class="header-container"></div>
			<ul class="posts">
				<li class="post">
					<div class="post-header" data-user-id="${postItem.userId}">
							<img src="${postItem.userImageUrl}" class="post-header__user-image">
							<p class="post-header__user-name">${postItem.userName}</p>
					</div>
					<div class="post-image-container">
						<img class="post-image" src="${postItem.postImageUrl}">
					</div>
					<div class="post-likes">
						<button data-post-id="${postItem.postId}" class="like-button">
							<img src="./assets/images/like-active.svg">
						</button>
						<p class="post-likes-text">
							Нравится: ${
								postItem.usersLikes.length > 0 ? `${ postItem.usersLikes[postItem.usersLikes.length - 1].name} 
										${postItem.length - 1 > 0 ? 'и ещё ' + (postItem.length - 1): ''}`: '0'
						}
						</p>
					</div>
					<p class="post-text">
						<span class="user-name">${postItem.userName}</span>
						${postItem.description}
					</p>
					<p class="post-date">
					${postItem.postCreatedAt}
					</p>
				</li>
			</ul>
		</div>`
	}).join();
		
	appEl.innerHTML = appHtml;

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
}