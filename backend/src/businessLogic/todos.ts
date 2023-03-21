import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate';
//import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

//write get todos function
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info('Get todos')
    return todosAccess.getAllTodos(userId);
}

//write create todo function
export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
    ): Promise<TodoItem> {
        logger.info('Create todo ')

        const todoId = uuid.v4()
        const createdAt = new Date().toISOString()
        const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
        const newItem = {
            userId,
            todoId,
            createdAt,
            done: false,
            attachmentUrl: s3AttachmentUrl,
            ...newTodo
        }
    return await todosAccess.createTodoItem(newItem)
}

//write update todo function
export async function updateTodo(
    todoId: string, 
    todoUpdate: UpdateTodoRequest,
    userId: string
    ): Promise<TodoUpdate> {
    logger.info('Update todo function call')
    return todosAccess.updateTodoItem(todoId, userId, todoUpdate)
}

//write delete todo function
export async function deleteTodo(
    todoId: string,
    userId: string    
    ): Promise<string> {
    logger.info('Delete todo function call')
    return todosAccess.deleteTodoItem(todoId, userId)
}

//write create Attachment function
export async function createAttachmentPresignedUrl(
    todoId: string,
    userId: string    
    ): Promise<string> {
    logger.info('Create Attachment function call by user id', userId, todoId)
    return attachmentUtils.getUploadUrl(todoId) 
}
