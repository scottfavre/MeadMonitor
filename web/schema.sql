BEGIN TRANSACTION

BEGIN TRY
	CREATE TABLE [dbo].[Devices](
		[Id] [int] IDENTITY(1,1) NOT NULL,
		[Address] [nvarchar](50) NOT NULL,
		[Name] [nvarchar](200) NULL,
		CONSTRAINT [PK_Devices] PRIMARY KEY CLUSTERED ( [Id] ASC ),
		CONSTRAINT [UQ_Devices_Address] UNIQUE ([Address])
	);
	
	CREATE TABLE [dbo].[Temperature](
		[Id] [bigint] IDENTITY(1,1) NOT NULL,
		[DeviceId] [int] NOT NULL,
		[Temperature] [float] NOT NULL,
		[Timestamp] [datetime] NOT NULL,
	 	CONSTRAINT [PK_Temperature] PRIMARY KEY CLUSTERED ( [Id] ASC ),
		CONSTRAINT [FK_Temperature_to_Devices] FOREIGN KEY (DeviceId) REFERENCES [dbo].[Devices] (Id)
	);
END TRY
BEGIN CATCH
	SELECT CAST(0 AS BIT), 0, NULL, ERROR_MESSAGE();
	ROLLBACK;
	RETURN;
END CATCH

COMMIT
GO