	package csci310;

import static org.junit.Assert.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.servlet.ServletException;

import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

public class SQLConnectTest {

	
	@BeforeClass
	public static void setUp() {
		SQLConnect.initConnection();
	}
	
	@Rule
	public final ExpectedException exception = ExpectedException.none();
	
	@Test
	public void testInitConnection() {
		SQLConnect.initConnection();
		assertTrue(SQLConnect.successfullyConnected==true);
		
		/*SQLConnect.databaseLocation = "";
		exception.expect(Exception.class);
		SQLConnect.initConnection();*/
		
	}
	
	@Test
	public void testRetrieveStock(){
		SQLConnect.currentUserId = 3;
		SQLConnect.retrieveStock();
		assertEquals(SQLConnect.successfullyRetrieved,true);
		
		SQLConnect.currentUserId = -1;
		SQLConnect.retrieveStock();
		assertEquals(SQLConnect.successfullyRetrieved,false);
	}
	
	
	@Test
	public void testAddUser() throws NoSuchAlgorithmException, InvalidKeySpecException {
		SQLConnect.addUser("testUser555", "testPassword");
		assertTrue(SQLConnect.userAdded);
		
		// test error
		SQLConnect.addUser("testUser1", "testPassword1");
		assertFalse(SQLConnect.userAdded); 
	}
	
	@Test(expected = Test.None.class)
	public void testRetrieveUser() {
		try {
			String user = SQLConnect.retrieveUser("testUser");
			assertEquals(user, "testUser");
			
			// test user doesn't exist
			String fakeUser = SQLConnect.retrieveUser("fake");
			assertEquals(fakeUser, "empty");
			
		}
		catch(SQLException sqle) {
			System.out.println("retrieve exception");
		}
	}
	
	
	@Test(expected = Test.None.class)
	public void testLogin() throws NoSuchAlgorithmException, InvalidKeySpecException {
		// successful login
		String loggedIn = SQLConnect.login("testUser", "testPassword");
		assertEquals("SamplePortfolioPage.jsp", loggedIn);
		
		//failed login-user does not exist
		String failedLogin = SQLConnect.login("test", "testPassword");
		assertEquals("login.jsp", failedLogin);
		
		//failed login-user exists but wrong password
		String failedLogin2 = SQLConnect.login("testUser", "wrongPassword");
		assertEquals("login.jsp", failedLogin2);
	
	}
	
	@Test(expected = Test.None.class)
	public void testDisplayAllUsers() {
		try {
			int count2 = SQLConnect.displayAllUsers();
			int count = SQLConnect.displayAllUsers();
			assertEquals(count2, count);
		}
		catch(SQLException sqle) {
			System.out.println("display exception");
		}
	}
	
	
	@Test
	public void testAddStocks() {
		SQLConnect.currentUserId = 3;
		SQLConnect.addStocks("AAPL", 23, "2019-07-6", "2018-06-05");
		assertEquals(SQLConnect.stockAdded,true);
		
		/*SQLConnect.currentUserId = -1;
		exception.expect(Exception.class);
		SQLConnect.addStocks("AAPL", 23, "2019-07-6", "2018-06-05");
		assertEquals(SQLConnect.stockAdded,false);*/
		
	}
	
	@Test
	public void testDeleteStock() {
		SQLConnect.currentUserId = 3;
		SQLConnect.addStocks("AAPL", 23, "2019-07-6", "2018-06-05");
		SQLConnect.deleteStock("AAPL", 23, "2019-07-6", "2018-06-05");
		assertEquals(SQLConnect.stockDeleted,true);
	}
	
	@Test(expected = Test.None.class)
	public void testGenerateStrongPassword() throws NoSuchAlgorithmException, InvalidKeySpecException {
		String password = SQLConnect.generateStrongPassword("testing");
	}
	
	@Test
	public void testValidatePassword() throws NoSuchAlgorithmException, InvalidKeySpecException {
		boolean matched = SQLConnect.validatePassword("testPassword", "1000:95ea6e3b947dfb6a48daeccdb78563dd:43091e1bb4ad99c9c7401e0b8f792dc3448e5c4042708d3851ac857202ee71bbed611bc100401454e528073373ee01541270b8c7144a5a3e6adb41394b47ee1c");
		assertTrue(matched);
		
		System.out.println("mismatched");
		boolean mismatched = SQLConnect.validatePassword("wrongPasswordhowaboutthisnow", "1000:9562789:123abcd362523839345678");
		assertFalse(mismatched);
	}
	
	@Test
	public void testToHex() throws NoSuchAlgorithmException, InvalidKeySpecException {
		byte[] salt = new byte[8];
		String result = SQLConnect.toHex(salt);
		assertEquals(result, "0000000000000000");
		
		SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
		byte[] salt2 = new byte[16];
		random.nextBytes(salt2);
		
		PBEKeySpec spec = new PBEKeySpec("testUser".toCharArray(), salt2, 1000, 64*8);
		SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
		byte[] hash = factory.generateSecret(spec).getEncoded();
		String result2 = SQLConnect.toHex(hash);
		assertTrue(SQLConnect.longHex);
	}
	
	@Test
	public void testFromHex() throws NoSuchAlgorithmException {
		String part = "95ea6e3b947dfb6a48daeccdb78563dd";
		byte[] salt = SQLConnect.fromHex(part);
		String salt2 = new String(salt, StandardCharsets.UTF_8);
		assertEquals(salt2, "��n;�}�jH��ͷ�c�");
	}
}
