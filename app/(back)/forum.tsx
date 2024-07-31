import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const InputField = ({ value, onChangeText, placeholder, style }) => (
  <TextInput
    style={[styles.input, style]}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor="gray"
  />
);

const Post = ({ post, onAddComment, onLike, onSave, hasLiked, isSaved, isExpanded, onPress }) => {
  const [newComment, setNewComment] = useState('');

  return (
    <View style={styles.post}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postContent}>{post.content}</Text>
          
          <View style={styles.actionContainer}>
            <View style={styles.likeAndSaveContainer}>
              <TouchableOpacity onPress={onLike} style={styles.actionButton}>
                <Icon name={hasLiked ? 'favorite' : 'favorite-border'} size={24} color={hasLiked ? 'red' : 'gray'} />
                <Text style={styles.likeCount}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSave} style={styles.actionButton}>
                <Icon name={isSaved ? 'bookmark' : 'bookmark-border'} size={24} color={isSaved ? 'green' : 'gray'} />
                <Text style={styles.saveCount}>{isSaved ? 'Saved' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.commentSection}>
              <TouchableOpacity style={styles.commentButton} onPress={onPress}>
                <Icon name="comment" size={24} color="#D3D3D3" />
                <Text style={styles.commentCount}>{post.comments.length}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      
      {isExpanded && (
        <View style={styles.commentsContainer}>
          <FlatList
            data={post.comments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.comment}>{item}</Text>}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
      
      {isExpanded && (
        <View style={styles.commentInputContainer}>
          <InputField
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Add a comment"
            style={styles.commentInput}
          />
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={() => {
              if (newComment.trim()) {
                onAddComment(post.id, newComment);
                setNewComment('');
              }
            }}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [viewSavedPosts, setViewSavedPosts] = useState(false);

  const handleAddPost = () => {
    if (newPost.trim() && newDescription.trim()) {
      const newPostObject = {
        id: posts.length + 1,
        title: newPost,
        content: newDescription,
        comments: [],
        likes: 0,
        hasLiked: false,
        isSaved: false,
      };
      setPosts([newPostObject, ...posts]); // Add new posts to the beginning
      setNewPost('');
      setNewDescription('');
      setShowInput(false);
    } else {
      alert('Please enter both title and description');
    }
  };

  const handleAddComment = (postId, comment) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.hasLiked ? post.likes - 1 : post.likes + 1, hasLiked: !post.hasLiked }
        : post
    ));
  };

  const handleSave = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const handlePressPost = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const handleViewSavedPosts = () => {
    setViewSavedPosts(!viewSavedPosts);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowInput(true)}>
          <Text style={styles.addButtonText}>Get New Post</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={handleViewSavedPosts}>
          <Text style={styles.addButtonText}>{viewSavedPosts ? 'View All Posts' : 'View Saved Posts'}</Text>
        </TouchableOpacity>
      </View>
      {showInput && (
        <View style={styles.inputContainer}>
          <InputField
            value={newPost}
            onChangeText={setNewPost}
            placeholder="Title"
            style={styles.titleInput}
          />
          <InputField
            value={newDescription}
            onChangeText={setNewDescription}
            placeholder="Description"
            style={styles.descriptionInput}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleAddPost}>
            <Text style={styles.submitButtonText}>Add Post</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={viewSavedPosts ? posts.filter(post => post.isSaved) : posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Post
            post={item}
            onAddComment={handleAddComment}
            onLike={() => handleLike(item.id)}
            onSave={() => handleSave(item.id)}
            hasLiked={item.hasLiked}
            isSaved={item.isSaved}
            isExpanded={item.id === expandedPostId}
            onPress={() => handlePressPost(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Main background color
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#228B22', // Green for buttons
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  addButtonText: {
    color: '#ffffff', // White text
    textAlign: 'center',
  },
  inputContainer: {
    width: width * 0.9, // Responsive width
    backgroundColor: '#1C1C1C', // Dark background for input container
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  post: {
    backgroundColor: '#1C1C1C', // Dark background for posts
    width: width * 0.9, // Responsive width
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  postTitle: {
    color: '#006400', // Dark Green for post title
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postContent: {
    color: '#D3D3D3', // Light Gray for post content
    marginBottom: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  likeAndSaveContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  likeCount: {
    color: '#D3D3D3', // Light Gray for like count
    marginLeft: 5,
    fontSize: 16,
  },
  saveCount: {
    color: '#D3D3D3', // Light Gray for save status
    marginLeft: 5,
    fontSize: 16,
  },
  commentSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#2B4', // Steel Blue for comment button
  },
  commentCount: {
    color: '#D3D3D3', // Light Gray for comment count
    marginLeft: 5,
    fontSize: 16,
  },
  commentsContainer: {
    marginTop: 10,
    maxHeight: 150,
  },
  comment: {
    color: '#D3D3D3', // Light Gray for comments
    marginBottom: 5,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#333333', // Dark Gray for comment input
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    color: '#D3D3D3', // Light Gray text for comment input
  },
  submitButton: {
    backgroundColor: '#228B22', // Green for submit button
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#ffffff', // White text for submit button
  },
  titleInput: {
    color: '#006400', // Dark Green for title input
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  descriptionInput: {
    color: '#D3D3D3', // Light Gray for description input
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333333', // Dark Gray border for input fields
    padding: 10,
    borderRadius: 5,
    color: '#D3D3D3', // Light Gray text for input fields
  },
});
