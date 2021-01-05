1- columns violate 1NF : dinner_date, food_code, food_description .
2- entities that could be extracted : member, dinner, vennue, food .
3- 3NF solution: make 5 tables (

table members has three columns : Id(PK), Name, Address.
table dinner has four columns : Id(PK), Date, Vennue_Code(FK), Order_no(FK), Member_ID(FK)
table vennue has two columns: Vennue_Code(PK), Description.
table food has two columns: Food_Code(PK), Description.
table dinner_order has three columns: Order_no(PK),Food_Code(PK).