import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.commentButton} onPress={onPress}>
              <Text style={styles.commentButtonText}>
                {isExpanded ? 'Hide Comments' : 'Show Comments'}
              </Text>
            </TouchableOpacity>
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
      setPosts([...posts, newPostObject]);
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
    backgroundColor: '#000000',
    paddingTop: 40,
  },
  buttonContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 1,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
  },
  inputContainer: {
    width: '60%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  post: {
    backgroundColor: '#ffffff',
    width: '60%',
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  postTitle: {
    color: 'darkgreen',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postContent: {
    color: 'black',
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
    marginLeft: 5,
    color: 'gray',
  },
  commentButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  commentButtonText: {
    color: 'white',
  },
  commentsContainer: {
    marginTop: 10,
    maxHeight: 150,
  },
  comment: {
    color: 'black',
    marginBottom: 5,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
  },
  titleInput: {
    color: 'darkgreen',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  descriptionInput: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    color: 'black',
  },
});