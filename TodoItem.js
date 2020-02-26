import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import PropTypes from "prop-types";

const { width } = Dimensions.get("window");

class TodoItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            isEditing: false,
            toDoValue: props.text
        }
    }
    static propTypes = {
        text: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        deleteToDo: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        completedToDo: PropTypes.func.isRequired, 
        unCompletedToDo: PropTypes.func.isRequired,
        updateToDo: PropTypes.func.isRequired
    }
    
    render(){
        const { isEditing, toDoValue } = this.state;
        const { text, id, deleteToDo, isCompleted } = this.props;

        return(
            <View style={styles.container}>
               <View style={styles.column}>
                    <TouchableOpacity onPress={this.toggleTodoComplete}>
                        <View style={[styles.circle, isCompleted ? styles.completedCircle:styles.uncompletedCircle]} />
                    </TouchableOpacity>
                    
                    {isEditing ? (
                        <TextInput style={[styles.input, styles.text, isCompleted ? styles.completedText:styles.uncompletedText]} value={toDoValue} multiline={true}
                                    onChangeText={this.handleTodoChange} returnKeyType={"done"} onBlur={this.onEditComplete}
                                    underlineColorAndroid={"transparent"}/>
                    ) : (
                        <Text style={[styles.text, isCompleted ? styles.completedText:styles.uncompletedText]}>{text}</Text>
                    )}
               </View>
               
                { isEditing ? (
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={this.onEditComplete}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>✅</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={this.handleTodoEdit}>
                            <View style={styles.actionContainer}>
                                {  
                                    isCompleted ? (
                                        null
                                    ) : (
                                        <Text style={styles.actionText}>✏️</Text>
                                    )
                                }
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPressOut={(event) => {
                            event.stopPropagation(); 
                            deleteToDo(id);
                        }}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>❌</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) }
               
            </View>
        );
    }

    toggleTodoComplete = (event) => {
        event.stopPropagation();
        const { isCompleted, completedToDo, unCompletedToDo, id } = this.props;
        if(isCompleted){
            unCompletedToDo(id);
        }else{
            completedToDo(id);
        }
    }

    handleTodoEdit = (event) => {
        event.stopPropagation();
        this.setState({
            isEditing: true
        })
    }

    onEditComplete = (event) => {
        event.stopPropagation();
        const { toDoValue } = this.state;
        const { id, updateToDo } = this.props;
        updateToDo(id, toDoValue);
        this.setState({
            isEditing: false
        })
    }

    handleTodoChange = (text) => {
        this.setState({
            toDoValue: text
        })
    }
}

const styles = StyleSheet.create({
    container: {
        width: width - 50,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#bbb",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text: {
        fontWeight: "600",
        fontSize: 20,
        marginVertical: 20
    },
    circle: {
        width: 24, 
        height: 24, 
        borderRadius: 12,
        borderColor: 'red',
        borderWidth: 3, 
        marginRight: 10
    },
    completedCircle: {
        borderColor: "#bbb"
    },
    uncompletedCircle: {
        borderColor: '#f23657'
    },
    completedText: {
        color: "#bbb",
        textDecorationLine: "line-through"
    }, 
    uncompletedText: {
        color: "#353535"
    },
    column: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width / 2
    },
    actions: {
        flexDirection: 'row'
    },
    actionContainer: {
        marginVertical: 15,
        marginHorizontal: 10
    },
    input: {
        marginVertical: 15,
        width: width / 2
    }
});

export default TodoItem
