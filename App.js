import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, 
  ScrollView, AsyncStorage, AppRegistry } from 'react-native';
import TodoItem from "./TodoItem";
import { AppLoading } from "expo";
import uuidv1 from "uuid/v1";

const {width} = Dimensions.get("window");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      syncMessage : null,
      progress : null
    }
  }
  
  state = {
    newToDo: "",
    loadedToDos: false,
    toDos: {}
  };

  componentDidMount = () => {
    this.getTodoList();
  }
  
  render(){
    const {newToDo, loadedToDos, toDos} = this.state;

    if(!loadedToDos){
      return <AppLoading />;
    }

    return(
      <View style={styles.container}>
      <StatusBar barStyle="light-content"/>
      <Text style={styles.title}>Todo List</Text>
      <View style={styles.card}>
        <TextInput style={styles.input} placeholder={"Input text"} 
          value={newToDo} onChangeText={this.handleTodoChange}
          placeholderTextColor={"#999"} returnKeyType={"done"} autoCorrect={false}
          onSubmitEditing={this.getSingleTodoItem}
          underlineColorAndroid={"transparent"}/> 
        <ScrollView contentContainerStyle={styles.todos}> 
          {
            Object.values(toDos)
            .reverse()
            .map(toDo => 
              <TodoItem key={toDo.id} 
                deleteToDo={this.handleTodoDelete}
                completedToDo={this.handleCompleteTodo}
                unCompletedToDo={this.handleIncompleteTodo}
                updateToDo={this.handleTodoUpdate}
                {...toDo} />
            )
          }
        </ScrollView>       
      </View>
    </View>
    )
  }
  handleTodoChange = (text) => {
    this.setState({
      newToDo: text
    });
  }

  getTodoList = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      this.setState({
        loadedToDos: true,
        toDos: this.retrieveTodos(toDos) 
      });
    } catch(error) {
      // TODO: Find more robust ways to handle errors
      console.log(error);
    }
  }

  retrieveTodos = (todos) => {
    if(todos == null)
      return {};
    else
      return JSON.parse(todos);
  }

  getSingleTodoItem = () => {
    const { newTodo } = this.state
    if(newTodo !== ""){
      this.setState(prevState => {
        const ID = uuidv1();
        const newTodoObj = {
          [ID]: { // Use computed property names to dynamically set todo ID
            id: ID, 
            isCompleted: false,
            text: newTodo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState, 
          newTodo: "",
          todos: {
            ...prevState.todos, 
            ...newTodoObj
          }
        };
        this.saveTodos(newState.toDos);
        return { ...newState };
      });
    }
  }

  handleTodoDelete = (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState, 
        ...toDos
      };
      this.saveTodos(newState.toDos);
      return { ...newState };
    });
  }

  handleIncompleteTodo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos, 
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
      this.saveTodos(newState.toDos);
      return { ...newState };
    });
  }

  handleCompleteTodo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos, 
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      };
      this.saveTodos(newState.toDos);
      return { ...newState };
    });
  }

  handleTodoUpdate = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos, 
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      };
      this.saveTodos(newState.toDos);
      return { ...newState };
    });
  }

  saveTodos = (newToDos) => {
    AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  }
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f23657',
    alignItems: 'center'
  },
  title: {
    color: "white",
    fontSize: 25,
    fontWeight: "200",
    marginTop: 40,
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50,50,50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1, 
          width: 0
        }
      },
      android: {
        elevation: 5
      }
    })
  },
  input: {
    padding: 20, 
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
    fontSize: 20
  },
  todos:{
    alignItems: 'center'
  }
});
