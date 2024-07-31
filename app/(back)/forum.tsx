import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Modal, Portal, Button } from 'react-native-paper';

const { width } = Dimensions.get('window');

interface PostType {
  id: number;
  title: string;
  content: string;
  comments: string[];
  likes: number;
  hasLiked: boolean;
  isSaved: boolean;
}

const InputField: React.FC<{ value: string; onChangeText: (text: string) => void; placeholder: string; style?: object }> = ({ value, onChangeText, placeholder, style }) => (
  <TextInput
    style={[styles.input, style]}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor="gray"
  />
);

const Post: React.FC<{
  post: PostType;
  onAddComment: (postId: number, comment: string) => void;
  onLike: (postId: number) => void;
  onSave: (postId: number) => void;
  hasLiked: boolean;
  isSaved: boolean;
  isExpanded: boolean;
  onPress: () => void;
}> = ({ post, onAddComment, onLike, onSave, hasLiked, isSaved, isExpanded, onPress }) => {
  const [newComment, setNewComment] = useState('');
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.post}>
      <TouchableWithoutFeedback onPress={showModal}>
        <View>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postContent}>{post.content}</Text>
          
          <View style={styles.actionContainer}>
            <View style={styles.likeAndSaveContainer}>
              <TouchableOpacity onPress={() => onLike(post.id)} style={styles.actionButton}>
                <Icon name={hasLiked ? 'favorite' : 'favorite-border'} size={24} color={hasLiked ? 'red' : 'gray'} />
                <Text style={styles.likeCount}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onSave(post.id)} style={styles.actionButton}>
                <Icon name={isSaved ? 'bookmark' : 'bookmark-border'} size={24} color={isSaved ? 'green' : 'gray'} />
                <Text style={styles.saveCount}>{isSaved ? 'Saved' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.commentSection}>
              <TouchableOpacity style={styles.commentButton}>
                <Icon name="comment" size={24} color="#D3D3D3" />
                <Text style={styles.commentCount}>{post.comments.length}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
          <View>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>
            
            <FlatList
              data={post.comments}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.comment}>{item}</Text>}
              showsVerticalScrollIndicator={false}
              style={styles.commentsContainer}
            />

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
        </Modal>
      </Portal>
    </View>
  );
};

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [viewSavedPosts, setViewSavedPosts] = useState(false);

  const handleAddPost = () => {
    if (newPost.trim() && newDescription.trim()) {
      const newPostObject: PostType = {
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

  const handleAddComment = (postId: number, comment: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.hasLiked ? post.likes - 1 : post.likes + 1, hasLiked: !post.hasLiked }
        : post
    ));
  };

  const handleSave = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const handlePressPost = (postId: number) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const handleViewSavedPosts = () => {
    setViewSavedPosts(!viewSavedPosts);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleViewSavedPosts}>
          <Text style={styles.addButtonText}>{viewSavedPosts ? 'View All Posts' : 'View Saved Posts'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowInput(true)}>
          <Text style={styles.addButtonText}>Create New Post</Text>
        </TouchableOpacity>
      </View>
      {showInput && (
        <View style={styles.inputContainer}>
          <InputField
            value={newPost}
            onChangeText={setNewPost}
            placeholder="Title"
            style={[styles.titleInput, styles.boldText]} // Added bold style
          />
          <InputField
            value={newDescription}
            onChangeText={setNewDescription}
            placeholder="Description"
            style={styles.descriptionInput} // Updated color
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Main background color
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'column', // Stack buttons vertically
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#228B22', // Green for buttons
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignSelf: 'center', // Center buttons
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
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 18,
    color: '#006400', // Dark green for titles
    fontWeight: 'bold',
    marginBottom: 10, // Space between title and description
  },
  postContent: {
    fontSize: 16,
    color: '#D3D3D3', // White text for content
    marginBottom: 10, // Space between content and comments
  },
  input: {
    backgroundColor: '#1C1C1C', // Dark background for input fields
    color: '#006400', // Dark green text
    borderWidth: 1,
    borderColor: '#006400', // Dark green border
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  titleInput: {
    fontSize: 18,
  },
  descriptionInput: {
    fontSize: 16,
    color: '#D3D3D3', // White text
  },
  submitButton: {
    backgroundColor: '#228B22', // Green for submit button
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff', // White text
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeAndSaveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  likeCount: {
    color: '#D3D3D3',
    marginLeft: 5,
  },
  saveCount: {
    color: '#D3D3D3',
    marginLeft: 5,
  },
  commentSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    color: '#D3D3D3',
    marginLeft: 5,
  },
  commentsContainer: {
    maxHeight: 150, // Adjust as needed
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    marginRight: 10,
  },
  comment: {
    color: '#D3D3D3', // Light gray for comments
    marginVertical: 5,
  },
  modalContainer: {
    backgroundColor: '#1C1C1C', // Dark background for modal
    padding: 20,
    borderRadius: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default Forum;
