import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import RegisterTab from "./components/RegisterTab";
import LoginTab from "./components/LoginTab";
import PostList from "./components/PostList";

interface CommentItem {
  id: number;
  content: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
}

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("posts");
  const [authToken, setAuthToken] = useState<string>(() => localStorage.getItem("api_token") || "");
  const [userName, setUserName] = useState<string>("");

  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsMap, setCommentsMap] = useState<Record<number, CommentItem[]>>({});
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);

  const [newPostTitle, setNewPostTitle] = useState<string>("");
  const [newPostBody, setNewPostBody] = useState<string>("");
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  const [regName, setRegName] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState<string>("");

  // 1. PALĪGFUNKCIJAS PĀRVIETOTAS AUGSTĀK (PIRMS useEffect)
  const getHeaders = (includeAuth = true): Record<string, string> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (includeAuth && authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    return headers;
  };

  const fetchComments = async (postId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        method: "GET",
        headers: getHeaders(false),
      });
      if (!response.ok) return;
      const data = await response.json();
      setCommentsMap((prev) => ({ ...prev, [postId]: data || [] }));
    } catch (error) {
      console.error("Kļūda ielādējot komentārus:", error);
    }
  };

  const fetchPostsAsync = async () => {
    setIsLoadingPosts(true);
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "GET",
        headers: getHeaders(false),
      });
      if (!response.ok) throw new Error(`HTTP kļūda: ${response.status}`);
      const data = await response.json();
      setPosts(data || []);
      if (Array.isArray(data)) {
        data.forEach((p: Post) => fetchComments(p.id));
      }
    } catch (error) {
      console.error("Kļūda saņemot rakstus (Fetch API):", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // 2. useEffect BLOKI ATRODAS PĒC FUNKCIJU DEKLARĀCIJAS
  useEffect(() => {
    if (authToken) {
      localStorage.setItem("api_token", authToken);
    } else {
      localStorage.removeItem("api_token");
    }
  }, [authToken]);

// eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => {
    fetchPostsAsync();
  }, []);
  const fetchPostsXHR = () => {
    setIsLoadingPosts(true);
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${API_BASE_URL}/posts`, true);
    const headers = getHeaders(false);
    for (const key in headers) {
      if (Object.prototype.hasOwnProperty.call(headers, key)) {
        xhr.setRequestHeader(key, headers[key]);
      }
    }
    xhr.onload = function () {
      setIsLoadingPosts(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          setPosts(data || []);
          if (Array.isArray(data)) {
            data.forEach((p: Post) => fetchComments(p.id));
          }
        } catch (e) {
          console.error("JSON apstrādes kļūda:", e);
        }
      } else {
        console.error(`XHR kļūda: ${xhr.status}`);
        alert("Neizdevās saņemt datus (XHR).");
      }
    };
    xhr.onerror = function () {
      setIsLoadingPosts(false);
      console.error("Tīkla kļūda pieprasījumā.");
    };
    xhr.send();
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostBody.trim()) {
      alert("Aizpildiet virsrakstu un tekstu.");
      return;
    }
    if (!authToken) {
      alert("Lūdzu, vispirms pieslēdzieties!");
      setActiveTab("login");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({ title: newPostTitle, body: newPostBody }),
      });
      if (response.ok) {
        setNewPostTitle("");
        setNewPostBody("");
        fetchPostsAsync();
      } else {
        const err = await response.json();
        alert("Kļūda izveidojot rakstu: " + JSON.stringify(err));
      }
    } catch (error) {
      console.error("Kļūda izveidojot rakstu:", error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm("Vai tiešām vēlaties dzēst šo rakstu?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: getHeaders(true),
      });
      if (response.ok) {
        fetchPostsAsync();
      } else {
        alert("Neizdevās dzēst rakstu.");
      }
    } catch (error) {
      console.error("Kļūda dzēšot rakstu:", error);
    }
  };

  const handleAddComment = async (postId: number) => {
    const content = (commentInputs[postId] || "").trim();
    if (!content) return;
    if (!authToken) {
      alert("Vispirms pieslēdzieties!");
      setActiveTab("login");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({ content }),
      });
      if (response.ok) {
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
        fetchComments(postId);
      }
    } catch (error) {
      console.error("Kļūda pievienojot komentāru:", error);
    }
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    if (!window.confirm("Dzēst komentāru?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: getHeaders(true),
      });
      if (response.ok) {
        fetchComments(postId);
      }
    } catch (error) {
      console.error("Kļūda dzēšot komentāru:", error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: getHeaders(false),
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword,
          password_confirmation: regPasswordConfirm,
        }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        setAuthToken(data.token);
        setUserName(data.user?.name || "");
        setActiveTab("posts");
      } else {
        alert("Kļūda: " + JSON.stringify(data.errors || data.message));
      }
    } catch (error) {
      console.error("Reģistrācijas kļūda:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: getHeaders(false),
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        setAuthToken(data.token);
        setUserName(data.user?.name || "");
        setActiveTab("posts");
      } else {
        alert("Kļūda: " + (data.message || "Neizdevās pieslēgties"));
      }
    } catch (error) {
      console.error("Pieslēgšanās kļūda:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: getHeaders(true),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setAuthToken("");
      setUserName("");
      setActiveTab("login");
    }
  };

  return (
    <div>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        authToken={authToken}
        handleLogout={handleLogout}
      />

      <main className="container">
        {activeTab === "register" && (
          <RegisterTab
            regName={regName}
            setRegName={setRegName}
            regEmail={regEmail}
            setRegEmail={setRegEmail}
            regPassword={regPassword}
            setRegPassword={setRegPassword}
            regPasswordConfirm={regPasswordConfirm}
            setRegPasswordConfirm={setRegPasswordConfirm}
            handleRegister={handleRegister}
          />
        )}

        {activeTab === "login" && (
          <LoginTab
            authToken={authToken}
            userName={userName}
            loginEmail={loginEmail}
            setLoginEmail={setLoginEmail}
            loginPassword={loginPassword}
            setLoginPassword={setLoginPassword}
            handleLogin={handleLogin}
          />
        )}

        {activeTab === "posts" && (
          <PostList
            posts={posts}
            commentsMap={commentsMap}
            isLoadingPosts={isLoadingPosts}
            newPostTitle={newPostTitle}
            setNewPostTitle={setNewPostTitle}
            newPostBody={newPostBody}
            setNewPostBody={setNewPostBody}
            commentInputs={commentInputs}
            setCommentInputs={setCommentInputs}
            handleCreatePost={handleCreatePost}
            fetchPostsAsync={fetchPostsAsync}
            fetchPostsXHR={fetchPostsXHR}
            handleDeletePost={handleDeletePost}
            handleAddComment={handleAddComment}
            handleDeleteComment={handleDeleteComment}
          />
        )}
      </main>
    </div>
  );
}