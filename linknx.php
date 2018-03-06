<?php
error_reporting(0);
$linknx_host = "127.0.0.1";
$linknx_port = 1028;
$max_result_lines = 1000;
header('Content-Type: application/xml; charset=iso-8859-1');

$sock = fsockopen($linknx_host, $linknx_port, $errno, $errstr, 30);
if (!$sock)
		$result = "<response status='error'>Unable to connect to linknx</response>\n";
else {
	fwrite($sock, file_get_contents("php://input") . chr(4));
	$result = '';
	$cnt = 0;
	while ($cnt < $max_result_lines && $sock && !feof($sock)) {
		$result .= fgets($sock, 128);
		$c = fgetc($sock);
		if ($c == "\4")	break;
		$result .= $c;
		$cnt++;
	}
	fclose($sock);
}
print($result);
?>