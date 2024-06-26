from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    link = models.URLField()
    author = models.CharField(max_length=200)
    pub_date = models.DateField()
    description = models.TextField()
    isbn = models.CharField(max_length=13, db_column='isbn')
    isbn13 = models.CharField(max_length=13, db_column='isbn13')
    item_id = models.IntegerField(unique=True, db_column='itemId')
    price_sales = models.DecimalField(max_digits=10, decimal_places=2, db_column='priceSales')
    price_standard = models.DecimalField(max_digits=10, decimal_places=2, db_column='priceStandard')
    mall_type = models.CharField(max_length=50, db_column='mallType')
    stock_status = models.CharField(max_length=50, blank=True, db_column='stockStatus')
    mileage = models.IntegerField(db_column='mileage')
    cover = models.URLField(db_column='cover')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, db_column='categoryId')
    publisher = models.CharField(max_length=200, db_column='publisher')
    sales_point = models.IntegerField(db_column='salesPoint')
    adult = models.BooleanField(default=False, db_column='adult')
    fixed_price = models.BooleanField(default=True, db_column='fixedPrice')
    customer_review_rank = models.IntegerField(db_column='customerReviewRank')

    def __str__(self):
        return self.title

