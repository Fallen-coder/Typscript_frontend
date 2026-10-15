import { type ChangeEvent } from "react";

interface CommentItem {
  id: number;
  content: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
}

interface PostListProps {
  posts: Post[];
  commentsMap: Record<number, CommentItem[]>;
  isLoadingPosts: boolean;
  newPostTitle: string;
  setNewPostTitle: (val: string) => void;
  newPostBody: string;
  setNewPostBody: (val: string) => void;
  commentInputs: Record<number, string>;
  setCommentInputs: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  handleCreatePost: () => void;
  fetchPostsAsync: () => void;
  fetchPostsXHR: () => void;
  handleDeletePost: (postId: number) => void;
  handleAddComment: (postId: number) => void;
  handleDeleteComment: (postId: number, commentId: number) => void;
}

export default function PostList({
  posts,
  commentsMap,
  isLoadingPosts,
  newPostTitle,
  setNewPostTitle,
  newPostBody,
  setNewPostBody,
  commentInputs,
  setCommentInputs,
  handleCreatePost,
  fetchPostsAsync,
  fetchPostsXHR,
  handleDeletePost,
  handleAddComment,
  handleDeleteComment,
}: PostListProps) {
  return (
    <section className="tab-content section">
      <h2>Raksti</h2>

      <div className="form-group">
        <h3>Izveidot jaunu rakstu</h3>
        <input
          type="text"
          placeholder="Virsraksts"
          value={newPostTitle}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPostTitle(e.target.value)}
        />
        <textarea
          placeholder="Raksta teksts..."
          value={newPostBody}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewPostBody(e.target.value)}
        />
        <button type="button" onClick={handleCreatePost}>
          Saglabāt rakstu
        </button>
      </div>

      <div className="posts-header">
        <h3>Visi raksti</h3>
        <div className="method-buttons">
          <button className="btn-secondary" type="button" onClick={fetchPostsAsync}>
            Atjaunot (Fetch API)
          </button>
          <button className="btn-secondary" type="button" onClick={fetchPostsXHR}>
            Atjaunot (XMLHttpRequest)
          </button>
        </div>
      </div>

      <div id="posts-list">
        {isLoadingPosts ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <span>Ielādē datus...</span>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
            Nav pieejamu rakstu.
          </div>
        ) : (
          posts.map((post) => {
            const comments = commentsMap[post.id];
            return (
              <div key={post.id} className="post-card">
                <h3>
                  {post.title} <small>ID: {post.id}</small>
                </h3>
                <p>{post.body}</p>
                <button className="btn-danger" onClick={() => handleDeletePost(post.id)}>
                  Dzēst rakstu
                </button>

                <div className="comments-section">
                  <h4>KOMENTĀRI</h4>
                  <div>
                    {!comments ? (
                      <i>Ielādē komentārus...</i>
                    ) : comments.length === 0 ? (
                      <i>Komentāru nav.</i>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="comment">
                          <p>{comment.content}</p>
                          <button
                            className="btn-danger"
                            style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                            onClick={() => handleDeleteComment(post.id, comment.id)}
                          >
                            Dzēst
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="comment-input-group">
                    <input
                      type="text"
                      placeholder="Rakstīt komentāru..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                    />
                    <button onClick={() => handleAddComment(post.id)}>Pievienot</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}