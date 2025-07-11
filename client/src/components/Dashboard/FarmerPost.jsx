// import { MdThumbUp, MdComment, MdShare, MdMoreVert } from "react-icons/md"

// const posts = [
//   {
//     id: 1,
//     author: "John Smith",
//     location: "Texas, USA",
//     initials: "JS",
//     time: "2 hours ago",
//     content:
//       "Just harvested my first batch of organic tomatoes this season! The yield is amazing thanks to the new irrigation system I installed. Anyone else trying organic farming this year?",
//     image: "/placeholder.svg?height=300&width=400",
//     likes: 24,
//     comments: 8,
//     shares: 3,
//   },
//   {
//     id: 2,
//     author: "Maria Garcia",
//     location: "California, USA",
//     initials: "MG",
//     time: "5 hours ago",
//     content:
//       "Weather has been perfect for corn planting! Started early this morning and covered 50 acres. The soil moisture is just right. Expecting a great season ahead 🌽",
//     image: "/placeholder.svg?height=300&width=400",
//     likes: 31,
//     comments: 12,
//     shares: 5,
//   },
//   {
//     id: 3,
//     author: "David Johnson",
//     location: "Iowa, USA",
//     initials: "DJ",
//     time: "1 day ago",
//     content:
//       "Sharing my experience with the new pest control method I tried this season. Reduced chemical usage by 60% while maintaining crop quality. Happy to share details with fellow farmers!",
//     image: "/placeholder.svg?height=300&width=400",
//     likes: 45,
//     comments: 18,
//     shares: 12,
//   },
// ]

// export function FarmerPost() {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-900">Community Posts</h2>
//       {posts.map((post) => (
//         <div key={post.id} className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
//                 <span className="text-sm font-medium">{post.initials}</span>
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900">{post.author}</h3>
//                 <p className="text-sm text-gray-500">
//                   {post.location} • {post.time}
//                 </p>
//               </div>
//             </div>
//             <button className="p-2 hover:bg-gray-100 rounded-lg">
//               <MdMoreVert className="w-4 h-4" />
//             </button>
//           </div>

//           <p className="text-gray-700 mb-4">{post.content}</p>

//           {post.image && (
//             <img
//               src={post.image || "/placeholder.svg"}
//               alt="Post content"
//               className="w-full h-64 object-cover rounded-lg mb-4"
//             />
//           )}

//           <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//             <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
//               <MdThumbUp className="w-4 h-4" />
//               <span className="text-sm">{post.likes}</span>
//             </button>
//             <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
//               <MdComment className="w-4 h-4" />
//               <span className="text-sm">{post.comments}</span>
//             </button>
//             <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
//               <MdShare className="w-4 h-4" />
//               <span className="text-sm">{post.shares}</span>
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }


//Provided by chatgpt
// import { MdThumbUp, MdComment, MdShare, MdMoreVert } from "react-icons/md";
// import { useEffect, useState } from "react";
// import { getAllPosts } from "../../api/postAPI";

// export function FarmerPost({ additionalPosts = [] }) {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const backendPosts = await getAllPosts();
//         setPosts([...additionalPosts, ...backendPosts]);
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//       }
//     };

//     fetchPosts();
//   }, [additionalPosts]);

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-900">Community Posts</h2>
//       {posts.map((post) => (
//         <div key={post._id || post.id} className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
//                 <span className="text-sm font-medium">
//                   {(post.initials || post.author || post.name || "?")
//                     .split(" ")
//                     .map((w) => w[0])
//                     .join("")
//                     .toUpperCase()}
//                 </span>
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900">{post.author || post.name}</h3>
//                 <p className="text-sm text-gray-500">
//                   {post.location} • {new Date(post.createdAt || post.time).toLocaleString()}
//                 </p>
//               </div>
//             </div>
//             <button className="p-2 hover:bg-gray-100 rounded-lg">
//               <MdMoreVert className="w-4 h-4" />
//             </button>
//           </div>

//           <p className="text-gray-700 mb-4">{post.content}</p>

//           {post.imageUrl && (
//             <img
//               src={post.imageUrl}
//               alt="Post content"
//               className="w-full h-64 object-cover rounded-lg mb-4"
//             />
//           )}

//           <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//             <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
//               <MdThumbUp className="w-4 h-4" />
//               <span className="text-sm">{post.likes || 0}</span>
//             </button>
//             <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
//               <MdComment className="w-4 h-4" />
//               <span className="text-sm">{post.comments || 0}</span>
//             </button>
//             <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
//               <MdShare className="w-4 h-4" />
//               <span className="text-sm">{post.shares || 0}</span>
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


//last code:
// src/components/Dashboard/FarmerPost.jsx
// src/components/FarmerPost.jsx
import { MdThumbUp, MdComment, MdShare, MdMoreVert } from "react-icons/md";

export function FarmerPost({ post }) {
  if (!post) return null;

  const name = post.name || "Anonymous";
  const description = post.description || "No description provided.";
  const createdAt = post.createdAt
    ? new Date(post.createdAt).toLocaleString()
    : "Unknown time";

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 min-h-[500px] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-200">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">{initials}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-500">{createdAt}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MdMoreVert className="w-4 h-4" />
          </button>
        </div>

        <p className="text-gray-700 mb-4">{description}</p>

        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full h-140 object-cover rounded-xl mb-6"
          />
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
        <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <MdThumbUp className="w-4 h-4" />
          <span className="text-sm">{post.likes || 0}</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <MdComment className="w-4 h-4" />
          <span className="text-sm">{post.comments || 0}</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <MdShare className="w-4 h-4" />
          <span className="text-sm">{post.shares || 0}</span>
        </button>
      </div>
    </div>
  );
}
