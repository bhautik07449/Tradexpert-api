# Reference schema.

we are migrating these tables to new project in nest js. 

DO following things.

1. read already created schema and make necessary changes.
2. read all these tables and optiize tables and relation between them.
3. create entity which is not creaated.
4. don't make all tables. if one to one, many to one or one to many relation is defined and if it is is optmized way skip that table 

5. add these if needed.
```
@UpdateDateColumn({ name: 'last_updated_at', nullable: true })
  lastUpdatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
```

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `status` enum('active','block','deleted','') NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `post_date` datetime NOT NULL,
  `blog_category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `photo` text NOT NULL,
  `blog_detail` text NOT NULL,
  `status` enum('active','inactive','deleted') NOT NULL,
  `blog_title` text NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `blog_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `blog_images` (
  `id` int(11) NOT NULL,
  `blog_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `type` varchar(255) NOT NULL,
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `logo` varchar(255) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `brand_products` (
  `id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `buyers` (
  `id` int(11) NOT NULL,
  `gender` enum('Mr','Mrs') NOT NULL DEFAULT 'Mr',
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `address` text,
  `activation_code` varchar(255) CHARACTER SET utf8 NOT NULL,
  `activation_date` datetime NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `business_type` enum('Distributor','Retailer','Manufacturing and Processing','Buying house','Trading unit','Warehousing and Distribution') DEFAULT 'Distributor',
  `website` varchar(255) DEFAULT NULL,
  `status` enum('active','pending','block','deleted') NOT NULL DEFAULT 'block',
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `page_title` text,
  `meta_keyword` text,
  `meta_description` text,
  `status` enum('active','block','deleted') NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `status` enum('active','block','deleted') NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `inquiries` (
  `id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `quantity` int(11) NOT NULL,
  `measurement_id` int(11) NOT NULL,
  `required_latest_price` int(11) NOT NULL,
  `requirement_frequency` enum('Monthly','Quarterly','Yearly') NOT NULL,
  `preferred_unit_price` int(11) NOT NULL,
  `currency_id` int(11) NOT NULL,
  `status` enum('active','block','deleted') NOT NULL DEFAULT 'active',
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `credit_accounts` (
  `id` bigint(20) NOT NULL,
  `legal_company_name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `country_id` bigint(20) NOT NULL,
  `company_established` bigint(20) NOT NULL,
  `number_of_employees` varchar(255) CHARACTER SET utf8 NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `bank_address` text NOT NULL,
  `bank_contact_name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `bank_email` varchar(255) CHARACTER SET utf8 NOT NULL,
  `company_name_trade_supplier_1` varchar(255) CHARACTER SET utf8 NOT NULL,
  `address_trade_supplier_1` text CHARACTER SET utf8 NOT NULL,
  `email_trade_supplier_1` varchar(255) CHARACTER SET utf8 NOT NULL,
  `contact_name_trade_supplier_1` varchar(255) CHARACTER SET utf8 NOT NULL,
  `years_trading_with_trade_supplier_1` varchar(255) CHARACTER SET utf8 NOT NULL,
  `company_name_trade_supplier_2` varchar(255) CHARACTER SET utf8 NOT NULL,
  `address_trade_supplier_2` text CHARACTER SET utf8 NOT NULL,
  `email_trade_supplier_2` varchar(255) CHARACTER SET utf8 NOT NULL,
  `contact_name_trade_supplier_2` varchar(255) CHARACTER SET utf8 NOT NULL,
  `years_trading_with_trade_supplier_2` varchar(255) CHARACTER SET utf8 NOT NULL,
  `agree_to_above` enum('Yes','No','Both','None') NOT NULL,
  `terms_requested` text CHARACTER SET utf8 NOT NULL,
  `your_name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `your_email` varchar(255) CHARACTER SET utf8 NOT NULL,
  `position_in_company` varchar(255) CHARACTER SET utf8 NOT NULL,
  `status` enum('active','deleted','pending','block') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `commercial_info` text,
  `seasonal_chart` text NOT NULL,
  `product_specific_policy` text,
  `product_status_id` varchar(255) DEFAULT NULL,
  `general_detail` text,
  `category_id` int(11) NOT NULL,
  `sub_category_id` int(11) NOT NULL DEFAULT '0',
  `child_category_id` int(11) NOT NULL,
  `tariff` float NOT NULL,
  `price` float NOT NULL,
  `is_new_arrival` tinyint(1) NOT NULL DEFAULT '0',
  `is_trending` tinyint(1) NOT NULL DEFAULT '0',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `page_title` text,
  `meta_keyword` text,
  `meta_description` text,
  `status` enum('active','block','deleted','') NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `product_applications` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` enum('active','block','deleted') NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `product_aspects` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `s_key` varchar(255) NOT NULL,
  `s_value` text NOT NULL,
  `status` enum('active','block','deleted') NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `product_certifications` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('active','block','deleted') NOT NULL DEFAULT 'block',
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('active','block','deleted','') NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `product_shipments` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `s_key` varchar(255) NOT NULL,
  `s_value` text NOT NULL,
  `status` enum('active','deleted') NOT NULL DEFAULT 'active',
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `product_specifications` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `s_key` varchar(255) NOT NULL,
  `s_value` text NOT NULL,
  `status` enum('active','block','deleted') NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `quotations` (
  `id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `sub_category_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `about_product` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `measurement_id` int(11) NOT NULL,
  `price` float NOT NULL,
  `currency_id` int(11) NOT NULL,
  `shipment_terms` text NOT NULL,
  `payment_terms` varchar(255) DEFAULT NULL,
  `company_certification` varchar(255) DEFAULT NULL,
  `product_certification` varchar(255) DEFAULT NULL,
  `business_email` varchar(255) NOT NULL,
  `valid_to` date NOT NULL,
  `place` varchar(255) NOT NULL,
  `status` enum('active','block','deleted') NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



CREATE TABLE `request_samples` (
  `id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `quantity` int(11) NOT NULL,
  `measurement_id` int(11) NOT NULL,
  `required_latest_price` int(11) NOT NULL,
  `pay_for_sample` tinyint(1) DEFAULT '0',
  `pay_for_shipment` tinyint(1) DEFAULT '0',
  `status` enum('active','block','deleted') NOT NULL DEFAULT 'active',
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `firm_name` varchar(255) DEFAULT NULL,
  `supplier_service_id` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `address` text,
  `product_category` text,
  `products` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `type` enum('Manufacturer','Trader','Agent') DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `status` enum('active','block','deleted') NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1

CREATE TABLE `measurements` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('active','block','deleted') NOT NULL,
  `description` text NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
