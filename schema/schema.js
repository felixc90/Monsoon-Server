const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/Author');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
      book: {
          type: BookType,
          args: { id: { type: GraphQLID } },
          resolve(parent, args){
              //return _.find(books, { id: args.id });
          }
      },
      author: {
          type: AuthorType,
          args: { id: { type: GraphQLID } },
          resolve(parent, args){
              //return _.find(authors, { id: args.id });
          }
      },
      books: {
          type: new GraphQLList(BookType),
          resolve(parent, args){
              //return books;
          }
      },
      authors: {
          type: new GraphQLList(AuthorType),
          resolve(parent, args){
              //return authors;
          }
      }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});